#include "TreeModule.h"
#include "GraphModule.h"
#include "AllocationModule.h"
#include "IOModule.h"
#include "Constants.h"
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " admin.txt graph.txt disaster.txt" << std::endl;
        return Constants::ExitCode::BAD_ARGS;
    }

    TreeModule tree;
    GraphModule graph;
    AllocationModule allocation(tree, graph);
    IOModule io(tree, graph, allocation);

    if (!io.loadAdmin(argv[1]) || !io.loadGraph(argv[2]) || !io.loadDisaster(argv[3])) {
        // Errors are printed inside IOModule
        return Constants::ExitCode::FILE_ERROR;
    }

    // Final Reporting
    tree.printSummary();
    io.printShelterSummary();

    return Constants::ExitCode::SUCCESS;
}
