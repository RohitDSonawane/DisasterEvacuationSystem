#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <string>

// System-wide constants
namespace Constants {
    const int INF = 1e9; // Infinity value for unreachable distance

    // Entity Types
    const std::string STATE = "STATE";
    const std::string DISTRICT = "DISTRICT";
    const std::string CITY = "CITY";
    const std::string ZONE = "ZONE";
    const std::string RELIEFCENTER = "RELIEFCENTER";

    // Keywords for Parsing
    const std::string ENTITY = "ENTITY";
    const std::string ROAD = "ROAD";
    const std::string AFFECTED = "AFFECTED";
    const std::string EVACUATE = "EVACUATE";

    // Exit Codes
    enum ExitCode {
        SUCCESS = 0,
        BAD_ARGS = 1,
        FILE_ERROR = 2
    };
}

#endif // CONSTANTS_H
