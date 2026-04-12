#include "IOModule.h"
#include <iostream>

IOModule::IOModule(TreeModule& t, GraphModule& g, AllocationModule& a)
    : tree(t), graph(g), allocation(a) {}

bool IOModule::loadAdmin(const std::string& filepath) {
    // Stub
    return false;
}

bool IOModule::loadGraph(const std::string& filepath) {
    // Stub
    return false;
}

bool IOModule::loadDisaster(const std::string& filepath) {
    // Stub
    return false;
}

void IOModule::printEvacuationPlan(const std::string& zoneName, const std::string& shelterName, int distance, const std::vector<std::string>& route) {
    // Stub
}

void IOModule::printError(const std::string& message) {
    std::cerr << "ERROR: " << message << std::endl;
}
