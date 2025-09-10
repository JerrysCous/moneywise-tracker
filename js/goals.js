// js/goals.js
class GoalsManager {
    constructor() {
        this.goals = [];
        this.loadGoals();
        this.setupEventListeners();
    }

    loadGoals() {
        const savedGoals = localStorage.getItem('moneywise_goals');
        if (savedGoals) {
            this.goals = JSON.parse(savedGoals);
        }
        this.renderGoals();
    }

    saveGoals() {
        localStorage.setItem('moneywise_goals', JSON.stringify(this.goals));
    }

    addGoal(name, targetAmount, deadline, category) {
        const newGoal = {
            id: Date.now().toString(),
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: 0,
            deadline: new Date(deadline).toISOString(),
            category,
            progress: 0
        };

        this.goals.push(newGoal);
        this.saveGoals();
        this.renderGoals();
    }

    updateGoalProgress(id, amount) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.currentAmount += parseFloat(amount);
            goal.progress = (goal.currentAmount / goal.targetAmount) * 100;
            this.saveGoals();
            this.renderGoals();
        }
    }

    deleteGoal(id) {
        this.goals = this.goals.filter(g => g.id !== id);
        this.saveGoals();
        this.renderGoals();
    }

    renderGoals() {
        const goalsContainer = document.getElementById('goalsContainer');
        if (!goalsContainer) return;

        if (this.goals.length === 0) {
            goalsContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-bullseye"></i>
          <p>No financial goals yet. Add your first goal to start tracking your progress!</p>
        </div>
      `;
            return;
        }

        goalsContainer.innerHTML = '';

        this.goals.forEach(goal => {
            const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const goalEl = document.createElement('div');
            goalEl.className = 'goal-card';
            goalEl.innerHTML = `
        <div class="goal-header">
          <h3>${goal.name}</h3>
          <div class="goal-actions">
            <button class="action-btn contribute" data-id="${goal.id}">
              <i class="fas fa-plus-circle"></i>
            </button>
            <button class="action-btn delete" data-id="${goal.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="goal-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${goal.progress}%"></div>
          </div>
          <div class="progress-stats">
            <span>${this.formatCurrency(goal.currentAmount)} / ${this.formatCurrency(goal.targetAmount)}</span>
            <span>${Math.min(100, Math.round(goal.progress))}%</span>
          </div>
        </div>
        <div class="goal-details">
          <span class="goal-category">${goal.category}</span>
          <span class="goal-deadline">${daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}</span>
        </div>
      `;

            goalsContainer.appendChild(goalEl);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.goal-actions .contribute').forEach(btn => {
            btn.addEventListener('click', (e) => this.showContributeModal(e.currentTarget.dataset.id));
        });

        document.querySelectorAll('.goal-actions .delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Are you sure you want to delete this goal?')) {
                    this.deleteGoal(e.currentTarget.dataset.id);
                }
            });
        });
    }

    showContributeModal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        const amount = prompt(`How much would you like to add to "${goal.name}"?`);
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            this.updateGoalProgress(goalId, parseFloat(amount));
        }
    }

    setupEventListeners() {
        const addGoalForm = document.getElementById('addGoalForm');
        if (addGoalForm) {
            addGoalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('goalName').value;
                const amount = document.getElementById('goalAmount').value;
                const deadline = document.getElementById('goalDeadline').value;
                const category = document.getElementById('goalCategory').value;

                this.addGoal(name, amount, deadline, category);

                // Reset form
                addGoalForm.reset();
            });
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.goalsManager = new GoalsManager();
});
