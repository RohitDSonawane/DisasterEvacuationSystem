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

void IOModule::printError(const std::string& message) {
    std::cerr << "ERROR: " << message << std::endl;
}
