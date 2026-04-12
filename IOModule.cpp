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
                tree.aggregatePopulation(); // Re-calculate tree metrics
            } else {
                printError("AFFECTED zone not found: " + zoneName);
            }
        } 
        else if (keyword == Constants::KW_EVACUATE) {
            if (!(ss >> zoneName >> count)) {
                printError("Malformed EVACUATE line: " + line);
                continue;
            }

            if (!allocation.evacuate(zoneName, count)) {
                // Error message is handled within AllocationModule or by the return status
            }
        }
    }

    file.close();
    return true;
}

void IOModule::printEvacuationPlan(const std::string& zoneName, const std::string& shelterName, int distance, const std::vector<std::string>& route) {
    // Stub
}

void IOModule::printError(const std::string& message) {
    std::cerr << "ERROR: " << message << std::endl;
}
