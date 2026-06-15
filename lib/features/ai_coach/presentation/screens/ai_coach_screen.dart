import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_colors.dart';

class AiCoachScreen extends ConsumerStatefulWidget {
  const AiCoachScreen({super.key});

  @override
  ConsumerState<AiCoachScreen> createState() => _AiCoachScreenState();
}

class _AiCoachScreenState extends ConsumerState<AiCoachScreen> {
  final _messageController = TextEditingController();
  final _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [
    _ChatMessage(
      text: "Hi! I'm your AI Habit Coach 🔥 I'm here to help you build better habits, stay motivated, and reach your goals. What would you like to work on today?",
      isUser: false,
    ),
  ];
  bool _isTyping = false;

  final _suggestions = [
    'Help me build a morning routine',
    'Why am I breaking my streak?',
    'How do I stay motivated?',
    'Create a 30-day plan for me',
  ];

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;
    setState(() {
      _messages.add(_ChatMessage(text: text, isUser: true));
      _isTyping = true;
    });
    _messageController.clear();
    _scrollToBottom();

    await Future.delayed(const Duration(milliseconds: 1200));

    final response = _getCoachResponse(text);
    setState(() {
      _isTyping = false;
      _messages.add(_ChatMessage(text: response, isUser: false));
    });
    _scrollToBottom();
  }

  String _getCoachResponse(String message) {
    final lower = message.toLowerCase();
    if (lower.contains('morning') || lower.contains('routine')) {
      return "Great goal! A solid morning routine is one of the best habits you can build. I suggest starting with just 3 things: (1) Wake up at a consistent time, (2) Drink a glass of water, (3) Do 5 minutes of stretching. Small wins build momentum! Want me to create a habit for you?";
    } else if (lower.contains('motivat')) {
      return "Motivation is fleeting — but systems are reliable! Instead of waiting to feel motivated, focus on making your habits as easy as possible. Try the 2-minute rule: make the habit so small it takes only 2 minutes. Once you start, you'll often continue!";
    } else if (lower.contains('streak') || lower.contains('broke')) {
      return "Don't be too hard on yourself! Missing once is an accident, missing twice is the start of a new (bad) habit. The key is to never miss twice. Get back on track today — even a 1-minute version of your habit counts!";
    } else if (lower.contains('plan') || lower.contains('30')) {
      return "I love the 30-day challenge mindset! Here's a framework:\n\n• Week 1: Focus on showing up (even 5 min counts)\n• Week 2: Increase duration/intensity slightly\n• Week 3: Add an accountability partner\n• Week 4: Reflect and reward yourself\n\nShall I help you set up specific habits for each week?";
    }
    return "That's a great question! Building habits is all about consistency over perfection. Remember: every small action compounds over time. What specific habit are you working on? I can give you more targeted advice!";
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.psychology, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('AI Coach', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                Text('Always here to help', style: TextStyle(fontSize: 11, color: AppColors.success)),
              ],
            ),
          ],
        ),
        backgroundColor: AppColors.backgroundDark,
        actions: [
          IconButton(icon: const Icon(Icons.refresh_outlined), onPressed: () {
            setState(() {
              _messages.clear();
              _messages.add(_ChatMessage(
                text: "Hi! I'm your AI Habit Coach 🔥 I'm here to help you build better habits, stay motivated, and reach your goals. What would you like to work on today?",
                isUser: false,
              ));
            });
          }),
        ],
      ),
      body: Column(
        children: [
          // Suggestion Chips
          if (_messages.length <= 1)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: _suggestions.map((s) {
                    return GestureDetector(
                      onTap: () => _sendMessage(s),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.backgroundCard,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.primary.withOpacity(0.4)),
                        ),
                        child: Text(s, style: const TextStyle(color: AppColors.primary, fontSize: 13)),
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),

          // Chat Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: _messages.length + (_isTyping ? 1 : 0),
              itemBuilder: (context, i) {
                if (_isTyping && i == _messages.length) {
                  return const _TypingIndicator();
                }
                return _MessageBubble(message: _messages[i]);
              },
            ),
          ),

          // Input Field
          Container(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            decoration: const BoxDecoration(
              color: AppColors.backgroundCard,
              border: Border(top: BorderSide(color: AppColors.border)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: const TextStyle(color: AppColors.textPrimary),
                    maxLines: null,
                    decoration: InputDecoration(
                      hintText: 'Ask your coach anything...',
                      hintStyle: const TextStyle(color: AppColors.textHint),
                      filled: true,
                      fillColor: AppColors.backgroundElevated,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                    ),
                    onSubmitted: _sendMessage,
                  ),
                ),
                const SizedBox(width: 10),
                GestureDetector(
                  onTap: () => _sendMessage(_messageController.text),
                  child: Container(
                    width: 46,
                    height: 46,
                    decoration: const BoxDecoration(
                      gradient: AppColors.primaryGradient,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String text;
  final bool isUser;
  const _ChatMessage({required this.text, required this.isUser});
}

class _MessageBubble extends StatelessWidget {
  final _ChatMessage message;
  const _MessageBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!message.isUser) ...[
            Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.psychology, color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: message.isUser ? AppColors.primary : AppColors.backgroundCard,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(18),
                  topRight: const Radius.circular(18),
                  bottomLeft: Radius.circular(message.isUser ? 18 : 4),
                  bottomRight: Radius.circular(message.isUser ? 4 : 18),
                ),
                border: message.isUser ? null : Border.all(color: AppColors.border),
              ),
              child: Text(
                message.text,
                style: TextStyle(
                  color: message.isUser ? Colors.white : AppColors.textPrimary,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
            ),
          ),
          if (message.isUser) const SizedBox(width: 8),
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.psychology, color: Colors.white, size: 16),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.backgroundCard,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(18),
                topRight: Radius.circular(18),
                bottomRight: Radius.circular(18),
                bottomLeft: Radius.circular(4),
              ),
              border: Border.all(color: AppColors.border),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _Dot(delay: 0),
                SizedBox(width: 4),
                _Dot(delay: 150),
                SizedBox(width: 4),
                _Dot(delay: 300),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  final int delay;
  const _Dot({required this.delay});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 8,
      height: 8,
      decoration: const BoxDecoration(color: AppColors.textHint, shape: BoxShape.circle),
    );
  }
}
