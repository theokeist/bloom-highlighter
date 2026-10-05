<?php
/**
 * Bloom PHP Stress Test
 * Testing: Interfaces, Types, Logic, and Mutation.
 */

namespace Bloom\Core;

use Exception;
use InvalidArgumentException;

interface DataProcessorInterface
{
    public function process(string $data): ?string;
}

abstract class BaseWorker implements DataProcessorInterface
{
    protected const VERSION = '1.2.5';
    private array $history = [];

    public function __construct(
        protected readonly string $id
    ) {}

    abstract public function execute(): bool;

    protected function log(string $entry): void
    {
        $this->history[] = $entry;
    }

    public function getHistory(): array
    {
        return $this->history;
    }
}

class HeavyWorker extends BaseWorker
{
    private static int $instances = 0;

    public function __construct(string $id)
    {
        parent::__construct($id);
        self::$instances++;
    }

    public function process(string $data): ?string
    {
        try {
            if (empty($data)) {
                throw new InvalidArgumentException("Data Empty");
            }

            // Logic and Flow
            $result = (strlen($data) > 10) && ($data !== 'INVALID');

            if ($result) {
                $this->log($data);
                return strtoupper($data);
            }

            return null;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return null;
        } finally {
            // Flow Test
        }
    }

    public function execute(): bool
    {
        $status = $this->process("RUNNING") !== null;
        return $status;
    }
}

$worker = new HeavyWorker("php-worker-1");
$worker->execute();
