#include "TreeModule.h"
#include "GraphModule.h"
#include "AllocationModule.h"
#include "IOModule.h"
#include "Constants.h"
#include <iostream>

int main(int argc, char* argv[]) {
    if (argc < 3 || argc > 4) {
        std::cerr << "Usage: " << argv[0] << " admin.txt graph.txt [disaster.txt]" << std::endl;
        return Constants::ExitCode::BAD_ARGS;
    }

    TreeModule tree;
    GraphModule graph;
    AllocationModule allocation(tree, graph);
    IOModule io(tree, graph, allocation);

    // Mandatories
    if (!io.loadAdmin(argv[1]) || !io.loadGraph(argv[2])) {
        return Constants::ExitCode::FILE_ERROR;
    }

    // Optional Disaster File
    if (argc == 4) {
        if (!io.loadDisaster(argv[3])) {
            return Constants::ExitCode::FILE_ERROR;
        }
    }

    // Initial Summaries
    tree.printSummary();
    io.printShelterSummary();

    // Enter Interactive Mode
    io.runInteractive();

    return Constants::ExitCode::SUCCESS;
}
