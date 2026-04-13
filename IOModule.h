#ifndef IOMODULE_H
#define IOMODULE_H

#include "TreeModule.h"
#include "GraphModule.h"
#include "AllocationModule.h"
#include <string>
#include <vector>

class IOModule {
private:
    TreeModule& tree;
    GraphModule& graph;
    AllocationModule& allocation;

public:
    IOModule(TreeModule& t, GraphModule& g, AllocationModule& a);
    bool loadAdmin(const std::string& filepath);
    bool loadGraph(const std::string& filepath);
    bool loadDisaster(const std::string& filepath);
    void runInteractive();
    void printEvacuationPlan(const EvacuationResult& result);
    void printShelterSummary() const;
    void printError(const std::string& message);
};

#endif // IOMODULE_H
