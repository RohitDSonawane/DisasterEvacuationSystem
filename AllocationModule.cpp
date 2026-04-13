#include "AllocationModule.h"
#include "Constants.h"
#include "TreeNode.h"
#include <iostream>
#include <algorithm>
#include <vector>
#include <map>

AllocationModule::AllocationModule(TreeModule& t, GraphModule& g) : tree(t), graph(g) {}

EvacuationResult AllocationModule::evacuate(const std::string& zoneName, int peopleCount) {
    EvacuationResult result;
    result.success = false;
    result.zoneName = zoneName;

    // 1. Run Dijkstra from the source zone
    std::map<std::string, int> distances = graph.dijkstra(zoneName);

    // 2. Identify all valid ReliefCenters with sufficient REMAINING capacity
    std::vector<TreeNode*> centers = tree.getAllReliefCenters();
    std::vector<std::pair<int, TreeNode*>> viableCenters;

    for (TreeNode* center : centers) {
        // Use occupancy to check available space
        if ((center->capacity - center->occupancy) >= peopleCount) {
            int dist = distances[center->name];
            if (dist != Constants::INFINITY_DIST) {
                viableCenters.push_back({dist, center});
            }
        }
    }

    // 3. Find the closest shelter
    if (viableCenters.empty()) {
        result.errorMessage = "No shelter with sufficient capacity reachable from " + zoneName;
        return result;
    }

    // Sort by distance
    std::sort(viableCenters.begin(), viableCenters.end(), [](const auto& a, const auto& b) {
        return a.first < b.first;
    });

    TreeNode* assignedShelter = viableCenters[0].second;
    int minDistance = viableCenters[0].first;

    // 4. Update Occupancy
    assignedShelter->occupancy += peopleCount;

    // 5. Build Result
    result.success = true;
    result.shelterName = assignedShelter->name;
    result.distance = minDistance;
    result.route = graph.getRoute(assignedShelter->name);

    return result;
}
