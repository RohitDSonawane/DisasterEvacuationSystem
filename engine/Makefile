# Disaster Evacuation Engine — build targets
CXX      = g++
CXXFLAGS = -std=c++17 -Wall -O2
TARGET   = reliefroute_engine
SRCS     = main.cpp AllocationModule.cpp GraphModule.cpp IOModule.cpp TreeModule.cpp TreeNode.cpp
OBJS     = $(SRCS:.cpp=.o)

.PHONY: all clean run run-json test

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGET) $(TARGET).exe

# Interactive CLI with default Maharashtra sample
run: $(TARGET)
	./$(TARGET) samples/admin.txt samples/graph.txt

# JSON mode (used by ReliefRoute backend)
run-json: $(TARGET)
	./$(TARGET) samples/admin.txt samples/graph.txt --json

# Quick smoke test: load data and exit
test: $(TARGET)
	@echo "=== Engine build OK ==="
	@./$(TARGET) samples/admin.txt samples/graph.txt samples/disaster.txt 2>&1 | head -5 || true
