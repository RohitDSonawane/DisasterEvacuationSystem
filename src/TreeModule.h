#ifndef TREEMODULE_H
#define TREEMODULE_H

#include "TreeNode.h"
#include <string>
#include <vector>

class TreeModule {
private:
    TreeNode* root;

    // Helpers
    void deleteTree(TreeNode* node);
    TreeNode* findRecursive(TreeNode* current, const std::string& name) const;
    int aggregateRecursive(TreeNode* node);
    void collectReliefCenters(TreeNode* node, std::vector<TreeNode*>& centers) const;
    void printSummaryRecursive(TreeNode* node) const;

public:
    TreeModule();
    ~TreeModule();

    bool insertNode(const std::string& parentName, const std::string& name, const std::string& type, int capacity = 0);
    TreeNode* searchNode(const std::string& name) const;
    void aggregatePopulation();
    void listReliefCenters(const std::string& regionName) const;
    std::vector<TreeNode*> getAllReliefCenters() const;
    void printSummary() const;
};

#endif // TREEMODULE_H
