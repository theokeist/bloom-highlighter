/**
 * Bloom C++ Stress Test
 * Testing: Templates, Interfaces (Abstract Classes), Memory (Smart Pointers), and Logic.
 */

#include <iostream>
#include <string>
#include <vector>
#include <memory>
#include <algorithm>

namespace Bloom::Core {

template <typename T>
class IProcessor {
public:
    virtual ~IProcessor() = default;
    virtual T process(T input) = 0;
};

class BaseEngine {
protected:
    std::string id;
    static inline const std::string VERSION = "3.2.1";

public:
    explicit BaseEngine(std::string name) : id(std::move(name)) {}
    virtual void start() = 0;
};

class CoreEngine : public BaseEngine, public IProcessor<std::string> {
private:
    std::vector<std::string> log;
    bool active = false;

public:
    using BaseEngine::BaseEngine;

    void start() override {
        if (!active) {
            active = true;
            std::cout << "Engine Started: " << id << " V" << VERSION << std::endl;
        }
    }

    std::string process(std::string input) override {
        try {
            if (input.empty()) {
                throw std::runtime_error("Empty input");
            }

            // Logic and Flow
            bool isValid = (input.length() > 5) && (input != "NULL");

            if (isValid) {
                log.push_back(input);
                return "PROCESSED_" + input;
            } else {
                return "REJECTED";
            }
        } catch (const std::exception& e) {
            std::cerr << "Caught: " << e.what() << std::endl;
            return "ERROR";
        }
    }

    // Prototype/Native equivalent test (Operator overloading)
    CoreEngine& operator<<(const std::string& data) {
        process(data);
        return *this;
    }
};

} // namespace Bloom::Core

int main() {
    using namespace Bloom::Core;
    auto engine = std::make_unique<CoreEngine>("cpp-core");

    engine->start();
    *engine << "test_data" << "more_data";

    std::string result = engine->process("sample");

    if (result == "REJECTED") {
        return 1;
    }

    return 0;
}
