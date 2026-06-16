import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../shared/widgets/custom_button.dart';

class CreateHabitScreen extends ConsumerStatefulWidget {
  const CreateHabitScreen({super.key});

  @override
  ConsumerState<CreateHabitScreen> createState() => _CreateHabitScreenState();
}

class _CreateHabitScreenState extends ConsumerState<CreateHabitScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _selectedCategory = AppConstants.habitCategories.first;
  String _selectedFrequency = AppConstants.habitFrequencies.first;
  TimeOfDay _reminderTime = const TimeOfDay(hour: 8, minute: 0);
  bool _reminderEnabled = true;
  bool _isLoading = false;
  Color _selectedColor = AppColors.primary;

  final List<Color> _colorOptions = [
    AppColors.primary,
    AppColors.secondary,
    const Color(0xFF4CAF50),
    const Color(0xFF2196F3),
    const Color(0xFF9C27B0),
    const Color(0xFFE91E63),
    const Color(0xFF00BCD4),
    const Color(0xFFFF5722),
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _createHabit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);
    // TODO: Save habit via provider
    await Future.delayed(const Duration(milliseconds: 500));
    setState(() => _isLoading = false);
    if (mounted) context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundDark,
      appBar: AppBar(
        title: const Text('Create Habit'),
        backgroundColor: AppColors.backgroundDark,
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => context.pop(),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Color Picker
              const Text('Color', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
              const SizedBox(height: 12),
              Row(
                children: _colorOptions.map((color) {
                  final isSelected = _selectedColor == color;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedColor = color),
                    child: Container(
                      margin: const EdgeInsets.only(right: 10),
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: isSelected ? Border.all(color: Colors.white, width: 2.5) : null,
                        boxShadow: isSelected ? [BoxShadow(color: color.withOpacity(0.5), blurRadius: 8)] : null,
                      ),
                      child: isSelected ? const Icon(Icons.check, color: Colors.white, size: 16) : null,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              // Habit Name
              TextFormField(
                controller: _nameController,
                style: const TextStyle(color: AppColors.textPrimary),
                decoration: const InputDecoration(
                  labelText: 'Habit Name *',
                  hintText: 'e.g. Morning Meditation',
                  prefixIcon: Icon(Icons.edit_outlined, color: AppColors.textHint),
                ),
                validator: (v) => v?.trim().isEmpty == true ? 'Please enter a habit name' : null,
              ),
              const SizedBox(height: 16),
              // Description
              TextFormField(
                controller: _descriptionController,
                style: const TextStyle(color: AppColors.textPrimary),
                maxLines: 3,
                decoration: const InputDecoration(
                  labelText: 'Description (optional)',
                  hintText: 'Why is this habit important to you?',
                  prefixIcon: Padding(
                    padding: EdgeInsets.only(bottom: 48),
                    child: Icon(Icons.notes_outlined, color: AppColors.textHint),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              // Category
              const Text('Category', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: AppConstants.habitCategories.map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _selectedCategory = cat),
                    backgroundColor: AppColors.backgroundCard,
                    selectedColor: AppColors.primary.withOpacity(0.2),
                    checkmarkColor: AppColors.primary,
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.primary : AppColors.textSecondary,
                      fontSize: 13,
                    ),
                    side: BorderSide(color: isSelected ? AppColors.primary : AppColors.border),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              // Frequency
              const Text('Frequency', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
              const SizedBox(height: 12),
              Row(
                children: AppConstants.habitFrequencies.map((freq) {
                  final isSelected = _selectedFrequency == freq;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedFrequency = freq),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : AppColors.backgroundCard,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: isSelected ? AppColors.primary : AppColors.border),
                        ),
                        child: Text(
                          freq,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: isSelected ? Colors.white : AppColors.textSecondary,
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              // Reminder
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundCard,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.notifications_outlined, color: AppColors.primary, size: 22),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Text('Daily Reminder', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                        ),
                        Switch(
                          value: _reminderEnabled,
                          onChanged: (v) => setState(() => _reminderEnabled = v),
                          activeColor: AppColors.primary,
                        ),
                      ],
                    ),
                    if (_reminderEnabled) ...[
                      const Divider(color: AppColors.divider),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Reminder Time', style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                        trailing: TextButton(
                          onPressed: () async {
                            final time = await showTimePicker(context: context, initialTime: _reminderTime);
                            if (time != null) setState(() => _reminderTime = time);
                          },
                          child: Text(
                            _reminderTime.format(context),
                            style: const TextStyle(color: AppColors.primary, fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 32),
              CustomButton(
                text: 'Create Habit',
                onPressed: _createHabit,
                isLoading: _isLoading,
                color: _selectedColor,
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
