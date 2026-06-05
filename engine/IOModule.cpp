#include "IOModule.h"
#include "Constants.h"
#include <iostream>
#include <fstream>
#include <sstream>

IOModule::IOModule(TreeModule& t, GraphModule& g, AllocationModule& a)
    : tree(t), graph(g), allocation(a) {}

bool IOModule::loadAdmin(const std::string& filepath) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        printError("Could not open admin file: " + filepath);
        return false;
    }

    std::string line;
    while (std::getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;

        std::stringstream ss(line);
        std::string keyword, type, name, parentName;
        int capacity = 0;

        if (!(ss >> keyword) || keyword != Constants::KW_ENTITY) continue;
        if (!(ss >> type >> name >> parentName)) {
             printError("Malformed ENTITY line: " + line);
             continue;
        }

        // Optional capacity (mostly for ReliefCenters)
        ss >> capacity;

        bool success = false;
        if (parentName == "NULL") {
            success = tree.insertNode("", name, type, capacity);
        } else {
            success = tree.insertNode(parentName, name, type, capacity);
        }

        if (!success) {
            printError("Failed to insert node: " + name + " (Parent: " + parentName + ")");
        }
    }

    file.close();
    return true;
}

bool IOModule::loadGraph(const std::string& filepath) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        printError("Could not open graph file: " + filepath);
        return false;
    }

    std::string line;
    while (std::getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;

        std::stringstream ss(line);
        std::string keyword, node1, node2;
        int weight;

        if (!(ss >> keyword) || keyword != Constants::KW_ROAD) continue;
        if (!(ss >> node1 >> node2 >> weight)) {
             printError("Malformed ROAD line: " + line);
             continue;
        }

        if (!graph.addEdge(node1, node2, weight)) {
            printError("Failed to add edge: " + node1 + " <-> " + node2);
        }
    }

    file.close();
    return true;
}

bool IOModule::loadDisaster(const std::string& filepath) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        printError("Could not open disaster file: " + filepath);
        return false;
    }

    std::string line;
    while (std::getline(file, line)) {
        if (line.empty() || line[0] == '#') continue;

        std::stringstream ss(line);
        std::string keyword, zoneName;
        int count;

        if (!(ss >> keyword)) continue;

        if (keyword == Constants::KW_AFFECTED) {
            if (!(ss >> zoneName >> count)) {
                printError("Malformed AFFECTED line: " + line);
                continue;
            }

            TreeNode* node = tree.searchNode(zoneName);
            if (node) {
                node->affectedPeople = count;
            } else {
                printError("AFFECTED zone not found: " + zoneName);
            }
        } 
        else if (keyword == Constants::KW_EVACUATE) {
            if (!(ss >> zoneName >> count)) {
                printError("Malformed EVACUATE line: " + line);
                continue;
            }

            EvacuationResult res = allocation.evacuate(zoneName, count);
            printEvacuationPlan(res);
        }
    }

    tree.aggregatePopulation();
    file.close();
    return true;
}

void IOModule::runInteractive() {
    std::string line;
    std::cout << "--- DISASTER EVACUATION SYSTEM INTERACTIVE MODE ---" << std::endl;
    std::cout << "Commands: AFFECTED <zone> <count>, EVACUATE <zone> <count>, STATUS, SUMMARY, EXIT" << std::endl;

    while (true) {
        std::cout << "> ";
        if (!std::getline(std::cin, line) || line == "EXIT") break;
        if (line.empty()) continue;

        std::stringstream ss(line);
        std::string command;
        ss >> command;

        // Convert to uppercase for robustness
        for (auto& c : command) c = std::toupper(c);

        if (command == "AFFECTED") {
            std::string zone;
            int count;
            if (ss >> zone >> count) {
                TreeNode* node = tree.searchNode(zone);
                if (node) {
                    node->affectedPeople = count;
                    tree.aggregatePopulation();
                    std::cout << "OK: Updated population for " << zone << std::endl;
                } else {
                    printError("Zone not found.");
                }
            } else {
                printError("Usage: AFFECTED <zone> <count>");
            }
        } 
        else if (command == "EVACUATE") {
            std::string zone;
            int count;
            if (ss >> zone >> count) {
                EvacuationResult res = allocation.evacuate(zone, count);
                printEvacuationPlan(res);
            } else {
                printError("Usage: EVACUATE <zone> <count>");
            }
        }
        else if (command == "STATUS") {
            tree.printSummary();
        }
        else if (command == "SUMMARY") {
            printShelterSummary();
        }
        else {
            std::cout << "Unknown command. Try: AFFECTED, EVACUATE, STATUS, SUMMARY, EXIT" << std::endl;
        }
    }
}

void IOModule::printEvacuationPlan(const EvacuationResult& result) {
    if (result.assignments.empty()) {
        printError(result.errorMessage);
        return;
    }

    std::cout << "--- Evacuation Plan for " << result.zoneName << " (" << result.totalPeople << " people) ---" << std::endl;
    
    for (size_t i = 0; i < result.assignments.size(); ++i) {
        const auto& sa = result.assignments[i];
        std::cout << " Assignment [" << (i + 1) << "]:" << std::endl;
        std::cout << "  Shelter  : " << sa.shelterName << " (Allocated: " << sa.peopleAllocated << ")" << std::endl;
        std::cout << "  Distance : " << sa.distance << " km" << std::endl;
        std::cout << "  Route    : ";
        for (size_t j = 0; j < sa.route.size(); ++j) {
            std::cout << sa.route[j] << (j == sa.route.size() - 1 ? "" : " -> ");
        }
        std::cout << std::endl;
    }

    if (!result.success || !result.errorMessage.empty()) {
        std::cout << " WARNING: " << result.errorMessage << std::endl;
    }
    std::cout << "--------------------------------------------------------" << std::endl << std::endl;
}

void IOModule::printShelterSummary() const {
    std::vector<TreeNode*> centers = tree.getAllReliefCenters();
    
    std::cout << "=== RELIEF CENTER STATUS SUMMARY ===" << std::endl;
    std::cout << "Name\t\tOccupancy\tCapacity\tStatus" << std::endl;
    std::cout << "--------------------------------------------------------" << std::endl;
    
    for (TreeNode* center : centers) {
        double occupancyRate = (center->capacity > 0) ? (double)center->occupancy / center->capacity * 100.0 : 0;
        std::cout << center->name << "\t" << center->occupancy << "\t\t" << center->capacity << "\t\t";
        if (occupancyRate >= 100.0) std::cout << "[FULL]";
        else if (occupancyRate >= 80.0) std::cout << "[CRITICAL]";
        else std::cout << "[OK]";
        std::cout << std::endl;
    }
    std::cout << "====================================" << std::endl << std::endl;
}

void IOModule::runJSONServer() {
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty() || line == "EXIT") break;

        // Very basic manual JSON command parsing
        if (line.find("\"cmd\": \"AFFECTED\"") != std::string::npos) {
            size_t zoneStart = line.find("\"zone\": \"") + 9;
            size_t zoneEnd = line.find("\"", zoneStart);
            std::string zone = line.substr(zoneStart, zoneEnd - zoneStart);
            
            size_t countStart = line.find("\"count\": ") + 9;
            size_t countEnd = line.find_first_of(",}", countStart);
            int count = std::stoi(line.substr(countStart, countEnd - countStart));

            TreeNode* node = tree.searchNode(zone);
            if (node) {
                node->affectedPeople = count;
                tree.aggregatePopulation();
                std::cout << "{\"success\": true, \"message\": \"Affected count updated for " << zone << "\"}" << std::endl;
            } else {
                std::cout << "{\"success\": false, \"message\": \"Zone not found\"}" << std::endl;
            }
        }
        else if (line.find("\"cmd\": \"EVACUATE\"") != std::string::npos) {
            size_t zoneStart = line.find("\"zone\": \"") + 9;
            size_t zoneEnd = line.find("\"", zoneStart);
            std::string zone = line.substr(zoneStart, zoneEnd - zoneStart);
            
            size_t countStart = line.find("\"count\": ") + 9;
            size_t countEnd = line.find_first_of(",}", countStart);
            int count = std::stoi(line.substr(countStart, countEnd - countStart));

            EvacuationResult res = allocation.evacuate(zone, count);
            std::cout << evacuationResultToJSON(res) << std::endl;
        }
        else if (line.find("\"cmd\": \"STATUS\"") != std::string::npos) {
            std::cout << treeToJSON(tree.getRoot()) << std::endl;
        }
        else if (line.find("\"cmd\": \"SUMMARY\"") != std::string::npos) {
            std::cout << shelterSummaryToJSON() << std::endl;
        }
        else if (line.find("\"cmd\": \"GRAPH\"") != std::string::npos) {
            std::cout << graphToJSON() << std::endl;
        }
        else if (line.find("\"cmd\": \"RELOAD\"") != std::string::npos) {

            // Re-load all data from current files (Node server will have updated them)
            // Note: This is a bit complex as we need to reset the tree/graph first.
            // For now, let's assume the Node server will restart the process for a full reload.
            // But we can implement a basic one if needed.
            std::cout << "{\"success\": true, \"message\": \"Reload requested (Note: Process restart recommended for full reload)\"}" << std::endl;
        }
    }
}

std::string IOModule::evacuationResultToJSON(const EvacuationResult& res) {
    std::stringstream ss;
    ss << "{\"success\": " << (res.success ? "true" : "false") 
       << ", \"zoneName\": \"" << res.zoneName << "\""
       << ", \"totalPeople\": " << res.totalPeople
       << ", \"errorMessage\": \"" << res.errorMessage << "\""
       << ", \"assignments\": [";
    
    for (size_t i = 0; i < res.assignments.size(); ++i) {
        const auto& sa = res.assignments[i];
        ss << "{\"shelterName\": \"" << sa.shelterName << "\""
           << ", \"peopleAllocated\": " << sa.peopleAllocated
           << ", \"distance\": " << sa.distance
           << ", \"route\": [";
        for (size_t j = 0; j < sa.route.size(); ++j) {
            ss << "\"" << sa.route[j] << "\"" << (j == sa.route.size() - 1 ? "" : ", ");
        }
        ss << "]}" << (i == res.assignments.size() - 1 ? "" : ", ");
    }
    ss << "]}";
    return ss.str();
}

std::string IOModule::treeToJSON(TreeNode* node) {
    if (!node) return "null";
    std::stringstream ss;
    ss << "{\"name\": \"" << node->name << "\""
       << ", \"type\": \"" << node->type << "\""
       << ", \"affectedPeople\": " << node->affectedPeople
       << ", \"capacity\": " << node->capacity
       << ", \"occupancy\": " << node->occupancy
       << ", \"children\": [";
    for (size_t i = 0; i < node->children.size(); ++i) {
        ss << treeToJSON(node->children[i]) << (i == node->children.size() - 1 ? "" : ", ");
    }
    ss << "]}";
    return ss.str();
}

std::string IOModule::shelterSummaryToJSON() {
    std::vector<TreeNode*> centers = tree.getAllReliefCenters();
    std::stringstream ss;
    ss << "[";
    for (size_t i = 0; i < centers.size(); ++i) {
        TreeNode* c = centers[i];
        double occupancyRate = (c->capacity > 0) ? (double)c->occupancy / c->capacity * 100.0 : 0;
        std::string status = "OK";
        if (occupancyRate >= 100.0) status = "FULL";
        else if (occupancyRate >= 80.0) status = "CRITICAL";

        ss << "{\"name\": \"" << c->name << "\""
           << ", \"occupancy\": " << c->occupancy
           << ", \"capacity\": " << c->capacity
           << ", \"status\": \"" << status << "\"}"
           << (i == centers.size() - 1 ? "" : ", ");
    }
    ss << "]";
    return ss.str();
}

std::string IOModule::graphToJSON() {
    auto adj = graph.getAdjList();
    std::stringstream ss;
    ss << "{\"nodes\": [";
    
    // Collect unique nodes
    std::vector<std::string> nodes;
    for (const auto& pair : adj) {
        nodes.push_back(pair.first);
    }
    
    for (size_t i = 0; i < nodes.size(); ++i) {
        ss << "\"" << nodes[i] << "\"" << (i == nodes.size() - 1 ? "" : ", ");
    }
    
    ss << "], \"edges\": [";
    
    bool firstEdge = true;
    for (const auto& pair : adj) {
        const std::string& u = pair.first;
        for (const auto& edge : pair.second) {
            const std::string& v = edge.first;
            int w = edge.second;
            
            // To avoid duplicates in undirected graph visualization, optional check here
            // But for simple JSON, we can just return all
            if (!firstEdge) ss << ", ";
            ss << "{\"from\": \"" << u << "\", \"to\": \"" << v << "\", \"weight\": " << w << "}";
            firstEdge = false;
        }
    }
    
    ss << "]}";
    return ss.str();
}

void IOModule::printError(const std::string& message) {

    std::cerr << "ERROR: " << message << std::endl;
}

