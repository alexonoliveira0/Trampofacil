
import 'package:flutter/material.dart';

void main() {
  runApp(const MercaIA());
}

class MercaIA extends StatelessWidget {
  const MercaIA({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MercaIA',
      home: Scaffold(
        appBar: AppBar(title: const Text('MercaIA')),
        body: const Center(
          child: Text('MercaIA MVP'),
        ),
      ),
    );
  }
}
