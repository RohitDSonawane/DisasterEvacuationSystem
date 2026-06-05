#include "TreeModule.h"
#include "GraphModule.h"
#include "AllocationModule.h"
#include "IOModule.h"
#include "Constants.h"
#include <iostream>

int main(int argc, char* argv[]) {
    std::string adminFile, graphFile, disasterFile;
    bool jsonMode = false;

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "--json") {
            jsonMode = true;
        } else if (adminFile.empty()) {
            adminFile = arg;
        } else if (graphFile.empty()) {
            graphFile = arg;
        } else if (disasterFile.empty()) {
            disasterFile = arg;
        }
    }

    if (adminFile.empty() || graphFile.empty()) {
        std::cerr << "Usage: " << argv[0] << " admin.txt graph.txt [disaster.txt] [--json]" << std::endl;
        return Constants::ExitCode::BAD_ARGS;
    }

    TreeModule tree;
    GraphModule graph;
    AllocationModule allocation(tree, graph);
    IOModule io(tree, graph, allocation);

    // Mandatories
    if (!io.loadAdmin(adminFile) || !io.loadGraph(graphFile)) {
        return Constants::ExitCode::FILE_ERROR;
    }

    // Optional Disaster File
    if (!disasterFile.empty()) {
        if (!io.loadDisaster(disasterFile)) {
            return Constants::ExitCode::FILE_ERROR;
        }
    }

    if (!jsonMode) {
        tree.printSummary();
        io.printShelterSummary();
        io.runInteractive();
    } else {
        io.runJSONServer();
    }

    return Constants::ExitCode::SUCCESS;
}
