#ifndef ALLOCATIONMODULE_H
#define ALLOCATIONMODULE_H

#include "TreeModule.h"
#include "GraphModule.h"
#include <string>

class AllocationModule {
private:
    TreeModule& tree;
    GraphModule& graph;

public:
    AllocationModule(TreeModule& t, GraphModule& g);
    bool evacuate(const std::string& zoneName, int peopleCount);
};

#endif // ALLOCATIONMODULE_H
