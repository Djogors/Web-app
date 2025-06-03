function renderNotifications() {
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = ''; // Clear the container

    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item`;
        notificationItem.dataset.id = notification.id;

        const notificationHTML = `
            <div class="notification-header d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <span class="read-indicator ${notification.read ? 'read' : ''}"></span>
                    <div class="notification-title">${notification.title}</div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="notification-date">${notification.date}</div>
                    <input type="checkbox" class="form-check-input notification-checkbox" ${notification.read ? 'checked' : ''}>
                </div>
            </div>
            <div class="notification-content ${notification.expanded ? 'expanded' : ''}">
                <p>${notification.content}</p>
                 ${respostaHTML}
                <div class="notification-actions">
                    <button class="mark-read-btn btn btn-primary btn-sm">${notification.read ? 'Marcar como não lida' : 'Marcar como lida'}</button>
                </div>
            </div>
        `;

        notificationItem.innerHTML = notificationHTML;
        container.appendChild(notificationItem);

        // Add click event to expand/collapse
        notificationItem.addEventListener('click', function (e) {
            if (e.target.closest('.notification-checkbox') || e.target.closest('.mark-read-btn')) {
                return;
            }
            const content = this.querySelector('.notification-content');
            content.classList.toggle('expanded');
        });

        // Add click event for checkbox
        const checkbox = notificationItem.querySelector('.notification-checkbox');
        checkbox.addEventListener('click', function () {
            const id = parseInt(notificationItem.dataset.id);
            const notification = notifications.find(n => n.id === id);
            notification.read = !notification.read;
            renderNotifications();
        });

        // Add click event for mark as read button
        const markReadBtn = notificationItem.querySelector('.mark-read-btn');
        markReadBtn.addEventListener('click', function () {
            const id = parseInt(notificationItem.dataset.id);
            const notification = notifications.find(n => n.id === id);
            notification.read = !notification.read;
            renderNotifications();
        });
    });
}