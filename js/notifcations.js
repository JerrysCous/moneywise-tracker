// js/notifications.js
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.loadNotifications();
    }

    loadNotifications() {
        const savedNotifications = localStorage.getItem('moneywise_notifications');
        if (savedNotifications) {
            this.notifications = JSON.parse(savedNotifications);
        }
    }

    saveNotifications() {
        localStorage.setItem('moneywise_notifications', JSON.stringify(this.notifications));
    }

    addNotification(title, message, type = 'info') {
        const notification = {
            id: Date.now().toString(),
            title,
            message,
            type, // 'info', 'success', 'warning', 'error'
            read: false,
            date: new Date().toISOString()
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationBadge();

        // Show toast notification
        this.showToast(notification);
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    showToast(notification) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${notification.type}`;
        toast.innerHTML = `
      <div class="toast-header">
        <h4>${notification.title}</h4>
        <button class="toast-close">×</button>
      </div>
      <div class="toast-body">
        ${notification.message}
      </div>
    `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 5000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
});
