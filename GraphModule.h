#ifndef GRAPHMODULE_H
#define GRAPHMODULE_H

#include <string>
#include <vector>
#include <map>

class GraphModule {
private:
    std::map<std::string, std::vector<std::pair<std::string, int>>> adjList;
    std::map<std::string, std::string> parentMap;

public:
    bool addEdge(const std::string& node1, const std::string& node2, int weight);
    std::map<std::string, int> dijkstra(const std::string& source);
    std::vector<std::string> getRoute(const std::string& destination) const;
    bool nodeExists(const std::string& name) const;
};

#endif // GRAPHMODULE_H
