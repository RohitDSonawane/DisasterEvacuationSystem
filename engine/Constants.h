#ifndef CONSTANTS_H
#define CONSTANTS_H

#include <string>

// System-wide constants
namespace Constants {
    const int INFINITY_DIST = 1e9; // Infinity value for unreachable distance

    // Entity Types
    const std::string TYPE_STATE = "STATE";
    const std::string TYPE_DISTRICT = "DISTRICT";
    const std::string TYPE_CITY = "CITY";
    const std::string TYPE_ZONE = "ZONE";
    const std::string TYPE_RELIEFCENTER = "RELIEFCENTER";

    // Keywords for Parsing
    const std::string KW_ENTITY = "ENTITY";
    const std::string KW_ROAD = "ROAD";
    const std::string KW_AFFECTED = "AFFECTED";
    const std::string KW_EVACUATE = "EVACUATE";

    // Exit Codes
    enum ExitCode {
        SUCCESS = 0,
        BAD_ARGS = 1,
        FILE_ERROR = 2
    };
}

#endif // CONSTANTS_H
