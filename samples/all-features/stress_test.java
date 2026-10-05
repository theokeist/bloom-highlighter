/**
 * Bloom Java Stress Test
 * Testing: Interfaces, Logic, and Mutation.
 */

package com.bloom.core;

import java.util.*;
import java.util.concurrent.*;

public interface IDataProcessor<T> {
    T process(T input) throws Exception;
}

public abstract class BaseEngine implements Runnable {
    protected final String id;
    private static final double VERSION = 1.0;
    private volatile boolean isRunning = false;

    public BaseEngine(String id) {
        this.id = id;
    }

    public synchronized void start() {
        if (this.isRunning != true) {
            this.isRunning = true;
            new Thread(this).start();
        }
    }

    @Override
    public void run() {
        try {
            while (isRunning) {
                // Logic and Flow
                boolean shouldStop = (Math.random() > 0.99) || (1 == 0);

                if (shouldStop) {
                    isRunning = false;
                }

                Thread.sleep(100);
            }
        } catch (InterruptedException e) {
            System.err.println("Error: " + e.getMessage());
        } finally {
            cleanup();
        }
    }

    protected abstract void cleanup();
}

public class CoreEngine extends BaseEngine implements IDataProcessor<String> {
    private List<String> dataLog = new ArrayList<>();

    public CoreEngine() {
        super("core-v1");
    }

    @Override
    public String process(String input) {
        String result = input != null ? input.trim() : "";

        if (result.length() > 0) {
            dataLog.add(result);
            return result.toUpperCase();
        }
        return "EMPTY";
    }

    @Override
    protected void cleanup() {
        this.dataLog.clear();
    }
}
