#include "AllocationModule.h"
#include "Constants.h"
#include "TreeNode.h"
#include <iostream>
#include <algorithm>
#include <vector>
#include <map>

AllocationModule::AllocationModule(TreeModule& t, GraphModule& g) : tree(t), graph(g) {}

bool AllocationModule::evacuate(const std::string& zoneName, int peopleCount) {
    // 1. Run Dijkstra from the source zone
    std::map<std::string, int> distances = graph.dijkstra(zoneName);

    // 2. Identify all valid ReliefCenters with sufficient capacity
    std::vector<TreeNode*> centers = tree.getAllReliefCenters();
    std::vector<std::pair<int, TreeNode*>> viableCenters;

    for (TreeNode* center : centers) {
        if (center->capacity >= peopleCount) {
            int dist = distances[center->name];
            if (dist != Constants::INFINITY_DIST) {
                viableCenters.push_back({dist, center});
            }
        }
    }

    // 3. Find the closest shelter
    if (viableCenters.empty()) {
        std::cerr << "ERROR: No shelter with sufficient capacity reachable from " << zoneName << std::endl;
        return false;
    }

    // Sort by distance (first element of pair)
    std::sort(viableCenters.begin(), viableCenters.end(), [](const auto& a, const auto& b) {
        return a.first < b.first;
    });

    TreeNode* assignedShelter = viableCenters[0].second;
    int minDistance = viableCenters[0].first;

    // 4. Get the full route
    std::vector<std::string> route = graph.getRoute(assignedShelter->name);

    // 5. Output the result
    std::cout << "Evacuation Plan:" << std::endl;
    std::cout << "Source Zone      : " << zoneName << std::endl;
    std::cout << "Assigned Shelter : " << assignedShelter->name << std::endl;
    std::cout << "Distance         : " << minDistance << " km" << std::endl;
    std::cout << "Route            : ";
    for (size_t i = 0; i < route.size(); ++i) {
        std::cout << route[i] << (i == route.size() - 1 ? "" : " -> "); 
    }
    std::cout << std::endl << std::endl;

    // Optional: Deduct capacity if required (PRD doesn't explicitly say to update state after allocation,
    // but typically capacity should decrease. However, PRD says "populations are processed individually, not split up").
    // I'll leave capacity as is unless instructed otherwise.
    
    return true;
}
