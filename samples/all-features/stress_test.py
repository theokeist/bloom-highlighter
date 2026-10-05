"""
Bloom Python Stress Test
Testing: Signature-First (def/class), Flow (if/try), and Native/Proto.
"""
from typing import Protocol, TypeVar, Optional, List, Dict, Any
import asyncio

T = TypeVar("T")

class Processor(Protocol):
    def process(self, data: Any) -> bool:
        ...

class CoreEngine:
    VERSION: str = "1.0.1"

    def __init__(self, name: str):
        self._name = name
        self.state: Optional[Dict[str, Any]] = None
        self._cache = []

    async def compute_action(self, input_val: int) -> int:
        global GLOBAL_LOG
        nonlocal self # Not valid here, but for keyword testing

        try:
            if input_val < 0:
                raise ValueError("Negative Input")

            if input_val == 0 or not input_val:
                return 100

            # Logic and Mutation
            self.state = {"val": input_val * 2}
            self._cache.append(self.state)

            result = (input_val + 10) // 2
            return result if result > 5 else 0

        except Exception as e:
            print(f"Error: {e}")
            return -1
        finally:
            print("Cleanup...")

    @classmethod
    def get_version(cls):
        return cls.VERSION

# Native/Dunder Test
def __str__(self):
    return f"Engine({self._name})"

async def main():
    engine = CoreEngine("Main")
    tasks = [engine.compute_action(i) for i in range(5)]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
