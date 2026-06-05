#include "GraphModule.h"
#include "Constants.h"
#include <queue>
#include <algorithm>
#include <iostream>

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
    std::map<std::string, int> distances;
    parentMap.clear();

    // Initialize all known nodes to INFINITY
    for (auto const& [node, neighbors] : adjList) {
        distances[node] = Constants::INFINITY_DIST;
    }
    
    // Ensure source node is included in distances even if it has no neighbors
    if (distances.find(source) == distances.end()) {
        distances[source] = Constants::INFINITY_DIST;
    }

    distances[source] = 0;

    // Min-heap: priority_queue stores {distance, node_name}
    std::priority_queue<std::pair<int, std::string>, std::vector<std::pair<int, std::string>>, std::greater<std::pair<int, std::string>>> pq;
    pq.push({0, source});

    while (!pq.empty()) {
        int d = pq.top().first;
        std::string u = pq.top().second;
        pq.pop();

        if (d > distances[u]) continue;

        for (auto const& edge : adjList[u]) {
            std::string v = edge.first;
            int weight = edge.second;

            if (distances[u] + weight < distances[v]) {
                distances[v] = distances[u] + weight;
                parentMap[v] = u;
                pq.push({distances[v], v});
            }
        }
    }

    return distances;
}

std::vector<std::string> GraphModule::getRoute(const std::string& destination) const {
    std::vector<std::string> route;
    std::string current = destination;
    
    while (parentMap.find(current) != parentMap.end()) {
        route.push_back(current);
        current = parentMap.at(current);
    }
    
    if (!route.empty() || (adjList.find(destination) != adjList.end() && !parentMap.empty())) {
         route.push_back(current); // Add the source node if a path exists
    }
    
    std::reverse(route.begin(), route.end());
    return route;
}

bool GraphModule::nodeExists(const std::string& name) const {
    return adjList.find(name) != adjList.end();
}
