import 'package:flutter/material.dart';

class Counter extends StatefulWidget {
  const Counter({super.key});

  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() {
    if (!mounted) return;
    setState(() {
      _count += 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Literal prose stays untouched; interpolation remains code.
    return Column(
      children: [
        Text('Count: $_count'),
        Text('Status: ${_count > 0 ? "started" : "waiting"}'),
        ElevatedButton(onPressed: _increment, child: const Text('Increment')),
      ],
    );
  }
}
