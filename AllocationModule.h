#ifndef ALLOCATIONMODULE_H
#define ALLOCATIONMODULE_H

#include "TreeModule.h"
#include "GraphModule.h"
#include <string>

struct EvacuationResult {
    bool success;
    std::string zoneName;
    std::string shelterName;
    int distance;
    std::vector<std::string> route;
    std::string errorMessage;
};

class AllocationModule {
private:
    TreeModule& tree;
    GraphModule& graph;

public:
    AllocationModule(TreeModule& t, GraphModule& g);
    EvacuationResult evacuate(const std::string& zoneName, int peopleCount);
};

#endif // ALLOCATIONMODULE_H
