#include "GraphModule.h"

bool GraphModule::addEdge(const std::string& node1, const std::string& node2, int weight) {
    if (node1 == node2) return false; // Exclude self-referential edges

    auto updateEdge = [&](const std::string& u, const std::string& v, int w) {
        bool found = false;
        for (auto& edge : adjList[u]) {
            if (edge.first == v) {
                edge.second = (w < edge.second) ? w : edge.second; // Keep MIN weight
                found = true;
                break;
            }
        }
        if (!found) {
            adjList[u].push_back({v, w});
        }
    };

    updateEdge(node1, node2, weight);
    updateEdge(node2, node1, weight);
    return true;
}

std::map<std::string, int> GraphModule::dijkstra(const std::string& source) {
    // Stub (to be implemented in next phase)
    return {};
}

std::vector<std::string> GraphModule::getRoute(const std::string& destination) const {
    // Stub (to be implemented in next phase)
    return {};
}

bool GraphModule::nodeExists(const std::string& name) const {
    return adjList.find(name) != adjList.end();
}
