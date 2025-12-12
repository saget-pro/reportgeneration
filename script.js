// EduTrack Pro - Complete Academic Management System
// Version 5.0 - Full CRUD Operations, Enhanced Reporting, Complete Responsive Design

// ====== DATA STRUCTURES ======
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let marks = JSON.parse(localStorage.getItem('marks')) || {};
let attendance = JSON.parse(localStorage.getItem('attendance')) || {};
let activities = JSON.parse(localStorage.getItem('activities')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];

// Global variables
let currentStudentPage = 1;
const itemsPerPage = 10;
let currentMarksPage = 1;
let currentReportsPage = 1;
let currentFilter = 'all';
let currentEditId = null;
let currentDeleteId = null;
let deleteType = null;

// Chart instances
let performanceChart = null;
let subjectDistributionChart = null;
let performanceTrendChart = null;
let gradeDistributionChart = null;
let classComparisonChart = null;

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    initSystem();
    setupEventListeners();
    initializeCharts();
    updateDashboard();
    updateTabBadges();
    loadNotifications();
    updateStorageInfo();
});

function initSystem() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Show dashboard by default
    switchTab('dashboard-tab');
    
    // Initialize with sample data if empty
    if (classes.length === 0 && students.length === 0 && subjects.length === 0) {
        initializeSampleData();
    }
    
    // Initialize all components
    populateAllSelects();
    renderClassesGrid();
    loadSubjectsList();
    loadRecentStudents();
    loadRecentActivity();
    loadTopPerformers();
    
    // Update notification count
    updateNotificationCount();
    
    // Set current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Initialize marks table if on marks tab
    if (window.location.hash === '#marks-tab') {
        populateMarksSelects();
    }
}

function initializeSampleData() {
    // Create sample classes
    const sampleClasses = [
        {
            id: 'CLS001',
            name: 'Grade 10A - Science',
            teacher: 'Ms. Sarah Johnson',
            grade: '10',
            academicYear: '2024-2025',
            description: 'Science Stream - Morning Session',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            studentCount: 2,
            status: 'active',
            color: '#6366f1'
        },
        {
            id: 'CLS002',
            name: 'Grade 11B - Commerce',
            teacher: 'Mr. David Wilson',
            grade: '11',
            academicYear: '2024-2025',
            description: 'Commerce Stream - Afternoon Session',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            studentCount: 1,
            status: 'active',
            color: '#10b981'
        }
    ];
    
    // Create sample subjects
    const sampleSubjects = [
        {
            id: 'SUB001',
            name: 'Mathematics',
            classId: 'CLS001',
            maxMarks: 100,
            passMarks: 40,
            color: '#6366f1',
            teacher: 'Ms. Sarah Johnson',
            createdAt: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'SUB002',
            name: 'Physics',
            classId: 'CLS001',
            maxMarks: 100,
            passMarks: 40,
            color: '#8b5cf6',
            teacher: 'Mr. Robert Chen',
            createdAt: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'SUB003',
            name: 'Chemistry',
            classId: 'CLS001',
            maxMarks: 100,
            passMarks: 40,
            color: '#06b6d4',
            teacher: 'Dr. Lisa Park',
            createdAt: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'SUB004',
            name: 'Biology',
            classId: 'CLS001',
            maxMarks: 100,
            passMarks: 40,
            color: '#10b981',
            teacher: 'Mr. James Wilson',
            createdAt: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'SUB005',
            name: 'English',
            classId: 'CLS002',
            maxMarks: 100,
            passMarks: 40,
            color: '#f59e0b',
            teacher: 'Ms. Emily Davis',
            createdAt: new Date().toISOString(),
            status: 'active'
        }
    ];
    
    // Create sample students
    const sampleStudents = [
        {
            id: 'STU001',
            name: 'Emma Wilson',
            school: 'Greenwood High School',
            email: 'emma.wilson@school.edu',
            parent: 'Michael Wilson',
            phone: '5551234567',
            dob: '2008-05-15',
            gender: 'Female',
            classId: 'CLS001',
            address: '123 Main St, Cityville',
            parentPhone: '5551234568',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'STU002',
            name: 'James Anderson',
            school: 'Lincoln Academy',
            email: 'james.anderson@school.edu',
            parent: 'Robert Anderson',
            phone: '5559876543',
            dob: '2007-11-22',
            gender: 'Male',
            classId: 'CLS001',
            address: '456 Oak Ave, Townsville',
            parentPhone: '5559876544',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active'
        },
        {
            id: 'STU003',
            name: 'Sophia Martinez',
            school: 'Maplewood School',
            email: 'sophia.martinez@school.edu',
            parent: 'Carlos Martinez',
            phone: '5554567890',
            dob: '2009-03-10',
            gender: 'Female',
            classId: 'CLS002',
            address: '789 Pine Rd, Villagetown',
            parentPhone: '5554567891',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active'
        }
    ];
    
    // Create sample marks
    const sampleMarks = {
        'STU001': {
            Mathematics: {
                term1: 92,
                term2: 88,
                term3: 90,
                final: 94,
                average: 91.0
            },
            Physics: {
                term1: 88,
                term2: 85,
                term3: 90,
                final: 89,
                average: 88.0
            },
            Chemistry: {
                term1: 94,
                term2: 90,
                term3: 92,
                final: 96,
                average: 93.0
            },
            Biology: {
                term1: 90,
                term2: 87,
                term3: 92,
                final: 91,
                average: 90.0
            },
            _meta: {
                totalObtained: 362,
                totalPossible: 400,
                percentage: 90.5,
                grade: 'A+',
                lastUpdated: new Date().toISOString(),
                rank: 1
            }
        },
        'STU002': {
            Mathematics: {
                term1: 85,
                term2: 82,
                term3: 88,
                final: 85,
                average: 85.0
            },
            Physics: {
                term1: 82,
                term2: 80,
                term3: 85,
                final: 83,
                average: 82.5
            },
            Chemistry: {
                term1: 88,
                term2: 85,
                term3: 90,
                final: 89,
                average: 88.0
            },
            Biology: {
                term1: 84,
                term2: 80,
                term3: 86,
                final: 85,
                average: 83.8
            },
            _meta: {
                totalObtained: 339.3,
                totalPossible: 400,
                percentage: 84.8,
                grade: 'A',
                lastUpdated: new Date().toISOString(),
                rank: 2
            }
        },
        'STU003': {
            English: {
                term1: 78,
                term2: 82,
                term3: 85,
                final: 80,
                average: 81.3
            },
            _meta: {
                totalObtained: 81.3,
                totalPossible: 100,
                percentage: 81.3,
                grade: 'A',
                lastUpdated: new Date().toISOString(),
                rank: 1
            }
        }
    };
    
    classes = sampleClasses;
    subjects = sampleSubjects;
    students = sampleStudents;
    marks = sampleMarks;
    
    // Update class student counts
    classes.forEach(cls => {
        cls.studentCount = students.filter(s => s.classId === cls.id).length;
    });
    
    // Create sample activities
    const sampleActivities = [
        {
            id: 'ACT001',
            message: 'System initialized with sample data',
            type: 'info',
            timestamp: new Date().toISOString()
        },
        {
            id: 'ACT002',
            message: 'Sample students added to the system',
            type: 'success',
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'ACT003',
            message: 'Sample classes created for demonstration',
            type: 'info',
            timestamp: new Date(Date.now() - 7200000).toISOString()
        }
    ];
    
    // Create sample notifications
    const sampleNotifications = [
        {
            id: 'NOT001',
            message: 'Welcome to EduTrack Pro! Sample data has been loaded.',
            type: 'info',
            timestamp: new Date().toISOString(),
            read: false
        },
        {
            id: 'NOT002',
            message: '3 students need grade updates',
            type: 'warning',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: false
        }
    ];
    
    activities = sampleActivities;
    notifications = sampleNotifications;
    
    saveToLocalStorage();
    logActivity('System initialized with sample data', 'info');
    showNotification('Sample data loaded successfully! You can now explore the system.', 'success');
}

// ====== THEME MANAGEMENT ======
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    showNotification(`Switched to ${newTheme} mode`, 'info');
    logActivity(`Changed theme to ${newTheme} mode`);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Mobile menu
    document.getElementById('mobileMenuBtn').addEventListener('click', openMobileSidebar);
    document.getElementById('closeMobileSidebar').addEventListener('click', closeMobileSidebar);
    document.getElementById('mobileOverlay').addEventListener('click', closeMobileSidebar);
    
    // FAB actions
    const fabMain = document.getElementById('fabMain');
    if (fabMain) {
        fabMain.addEventListener('click', toggleFABActions);
    }
    
    // Search functionality
    const searchStudent = document.getElementById('searchStudents');
    if (searchStudent) {
        searchStudent.addEventListener('input', debounce(filterStudents, 300));
    }
    
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', debounce(globalSearchHandler, 500));
    }
    
    // Forms
    const classForm = document.getElementById('classForm');
    if (classForm) {
        classForm.addEventListener('submit', handleClassForm);
    }
    
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', handleStudentForm);
    }
    
    const subjectForm = document.getElementById('subjectForm');
    if (subjectForm) {
        subjectForm.addEventListener('submit', handleSubjectForm);
    }
    
    // Modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = this.closest('.modal').id;
            closeModal(modalId);
        });
    });
    
    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    // Window resize for responsiveness
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav-user')) {
            closeUserDropdown();
        }
        if (!event.target.closest('.notification-bell')) {
            closeNotifications();
        }
        if (!event.target.closest('.modal-content')) {
            if (event.target.classList.contains('modal')) {
                closeAllModals();
            }
        }
    });
    
    // Attendance date change
    const attendanceDate = document.getElementById('attendanceDate');
    if (attendanceDate) {
        attendanceDate.addEventListener('change', loadAttendance);
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ====== MOBILE FUNCTIONS ======
function openMobileSidebar() {
    document.getElementById('mobileSidebar').classList.add('show');
    document.getElementById('mobileOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
    document.getElementById('mobileSidebar').classList.remove('show');
    document.getElementById('mobileOverlay').style.display = 'none';
    document.body.style.overflow = '';
}

function toggleFABActions() {
    const fabActions = document.querySelector('.fab-actions');
    const fabMain = document.getElementById('fabMain');
    if (!fabActions || !fabMain) return;
    
    const isVisible = fabActions.style.opacity === '1';
    
    if (isVisible) {
        fabActions.style.opacity = '0';
        fabActions.style.transform = 'translateY(20px)';
        fabActions.style.pointerEvents = 'none';
        fabMain.style.transform = 'rotate(0deg)';
    } else {
        fabActions.style.opacity = '1';
        fabActions.style.transform = 'translateY(0)';
        fabActions.style.pointerEvents = 'all';
        fabMain.style.transform = 'rotate(45deg)';
    }
}

function hideFABActions() {
    const fabActions = document.querySelector('.fab-actions');
    const fabMain = document.getElementById('fabMain');
    if (!fabActions || !fabMain) return;
    
    fabActions.style.opacity = '0';
    fabActions.style.transform = 'translateY(20px)';
    fabActions.style.pointerEvents = 'none';
    fabMain.style.transform = 'rotate(0deg)';
}

function handleResize() {
    if (window.innerWidth > 1023) {
        closeMobileSidebar();
    }
    hideFABActions();
    handleResponsiveLayout();
}

function handleResponsiveLayout() {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.content-row').forEach(row => {
            if (row.classList.contains('grid-2')) {
                row.style.gridTemplateColumns = '1fr';
            }
        });
    } else {
        document.querySelectorAll('.content-row').forEach(row => {
            if (row.classList.contains('grid-2')) {
                row.style.gridTemplateColumns = '1fr 1fr';
            }
        });
    }
}

// ====== KEYBOARD SHORTCUTS ======
function handleKeyboardShortcuts(e) {
    // Only trigger when not in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        return;
    }
    
    // Ctrl/Cmd + N: New Student
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showAddStudentModal();
    }
    
    // Ctrl/Cmd + C: New Class
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        showCreateClassModal();
    }
    
    // Ctrl/Cmd + M: Marks Entry
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        switchTab('marks-tab');
    }
    
    // Ctrl/Cmd + R: Reports
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        switchTab('reports-tab');
    }
    
    // Esc: Close modals
    if (e.key === 'Escape') {
        closeAllModals();
    }
    
    // F1: Help
    if (e.key === 'F1') {
        e.preventDefault();
        showNotification('Keyboard Shortcuts: Ctrl+N (New Student), Ctrl+C (New Class), Ctrl+M (Marks), Ctrl+R (Reports), Esc (Close)', 'info', 5000);
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    closeUserDropdown();
    closeNotifications();
}

// ====== TAB MANAGEMENT ======
function switchTab(tabId) {
    // Close mobile sidebar if open
    closeMobileSidebar();
    hideFABActions();
    
    // Update sidebar buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Update active button in sidebar
    const sidebarBtn = document.querySelector(`.sidebar-btn[onclick*="${tabId}"]`);
    if (sidebarBtn) {
        sidebarBtn.classList.add('active');
    }
    
    // Update mobile sidebar buttons
    document.querySelectorAll('.mobile-sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const mobileBtn = document.querySelector(`.mobile-sidebar-btn[onclick*="${tabId}"]`);
    if (mobileBtn) {
        mobileBtn.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Load specific tab data
    switch(tabId) {
        case 'students-tab':
            loadStudentsTable();
            break;
        case 'marks-tab':
            populateMarksSelects();
            break;
        case 'reports-tab':
            loadReports();
            updateClassPerformanceChart();
            break;
        case 'classes-tab':
            renderClassesGrid();
            break;
        case 'subjects-tab':
            loadSubjectsList();
            break;
        case 'dashboard-tab':
            updateDashboard();
            break;
        case 'attendance-tab':
            loadAttendance();
            break;
        case 'analytics-tab':
            updateAnalytics();
            break;
        case 'settings-tab':
            loadSettings();
            break;
    }
    
    logActivity(`Switched to ${tabId.replace('-tab', '')} tab`);
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info', duration = 5000) {
    // Create toast using Toastify if available
    if (typeof Toastify !== 'undefined') {
        const backgroundColor = type === 'success' ? '#10b981' :
                               type === 'error' ? '#ef4444' :
                               type === 'warning' ? '#f59e0b' : '#6366f1';
        
        Toastify({
            text: message,
            duration: duration,
            gravity: "top",
            position: "right",
            backgroundColor: backgroundColor,
            stopOnFocus: true,
        }).showToast();
    } else {
        // Fallback to custom notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 1rem 1.5rem;
            background-color: var(--bg-card);
            border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: center;
            gap: 1rem;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
            z-index: 3000;
        `;
        
        const iconClass = type === 'success' ? 'fa-check-circle' :
                         type === 'error' ? 'fa-exclamation-circle' :
                         type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        notification.innerHTML = `
            <i class="fas ${iconClass}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) notification.remove();
                }, 300);
            }
        }, duration);
    }
    
    // Add to notifications array
    const notificationObj = {
        id: 'NOT' + Date.now(),
        message: message,
        type: type,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notificationObj);
    if (notifications.length > 50) notifications.pop();
    
    updateNotificationCount();
    saveToLocalStorage();
}

function loadNotifications() {
    updateNotificationCount();
}

function updateNotificationCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        notificationCount.textContent = unreadCount;
        if (unreadCount > 0) {
            notificationCount.style.display = 'flex';
        } else {
            notificationCount.style.display = 'none';
        }
    }
}

function toggleNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (panel.classList.contains('show')) {
        closeNotifications();
    } else {
        openNotifications();
    }
}

function openNotifications() {
    const panel = document.getElementById('notificationsPanel');
    const list = document.getElementById('notificationsList');
    const empty = document.getElementById('emptyNotifications');
    
    if (notifications.length === 0) {
        list.style.display = 'none';
        empty.style.display = 'block';
    } else {
        list.style.display = 'block';
        empty.style.display = 'none';
        
        // Display last 10 notifications
        list.innerHTML = notifications.slice(0, 10).map(n => `
            <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationAsRead('${n.id}')">
                <div class="notification-icon ${n.type}">
                    <i class="fas fa-${n.type === 'success' ? 'check-circle' : n.type === 'error' ? 'exclamation-circle' : n.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <p>${n.message}</p>
                    <small class="notification-time">${formatTimeAgo(n.timestamp)}</small>
                </div>
            </div>
        `).join('');
        
        // Mark all as read
        notifications.forEach(n => n.read = true);
        updateNotificationCount();
        saveToLocalStorage();
    }
    
    panel.classList.add('show');
}

function closeNotifications() {
    const panel = document.getElementById('notificationsPanel');
    panel.classList.remove('show');
}

function markNotificationAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        updateNotificationCount();
        saveToLocalStorage();
    }
}

function clearNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        notifications = [];
        updateNotificationCount();
        saveToLocalStorage();
        openNotifications();
        showNotification('All notifications cleared', 'success');
    }
}

// ====== ACTIVITY LOGGING ======
function logActivity(message, type = 'info') {
    const activity = {
        id: 'ACT' + Date.now(),
        message: message,
        type: type,
        timestamp: new Date().toISOString()
    };
    
    activities.unshift(activity);
    if (activities.length > 100) activities.pop();
    
    saveToLocalStorage();
}

// ====== CLASS MANAGEMENT ======
function showCreateClassModal() {
    document.getElementById('classModalTitle').textContent = 'Create Class';
    document.getElementById('classSubmitText').textContent = 'Create Class';
    document.getElementById('editClassId').value = '';
    document.getElementById('classForm').reset();
    document.getElementById('classColor').value = '#6366f1';
    document.getElementById('academicYear').value = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
    openModal('classModal');
}

function handleClassForm(e) {
    e.preventDefault();
    
    const classId = document.getElementById('editClassId').value;
    
    if (classId) {
        updateClass(classId);
    } else {
        createClass();
    }
}

function createClass() {
    const classData = {
        id: 'CLS' + Date.now().toString().slice(-6),
        name: document.getElementById('className').value.trim(),
        teacher: document.getElementById('classTeacher').value.trim(),
        grade: document.getElementById('classGrade').value,
        academicYear: document.getElementById('academicYear').value.trim() || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        description: document.getElementById('classDescription').value.trim(),
        color: document.getElementById('classColor').value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        studentCount: 0,
        status: 'active'
    };
    
    // Validate
    if (!classData.name || !classData.teacher || !classData.grade) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Check if class with same name and grade already exists
    const existingClass = classes.find(c => 
        c.name.toLowerCase() === classData.name.toLowerCase() && 
        c.grade === classData.grade
    );
    
    if (existingClass) {
        showNotification('A class with this name and grade already exists!', 'error');
        return;
    }
    
    classes.push(classData);
    saveToLocalStorage();
    
    showNotification(`Class "${classData.name}" created successfully!`, 'success');
    closeModal('classModal');
    renderClassesGrid();
    populateAllSelects();
    updateDashboard();
    logActivity(`Created new class: ${classData.name}`, 'success');
}

function updateClass(classId) {
    const classData = {
        name: document.getElementById('className').value.trim(),
        teacher: document.getElementById('classTeacher').value.trim(),
        grade: document.getElementById('classGrade').value,
        academicYear: document.getElementById('academicYear').value.trim(),
        description: document.getElementById('classDescription').value.trim(),
        color: document.getElementById('classColor').value,
        updatedAt: new Date().toISOString()
    };
    
    // Validate
    if (!classData.name || !classData.teacher || !classData.grade) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    const index = classes.findIndex(c => c.id === classId);
    if (index !== -1) {
        // Check if another class has the same name and grade
        const duplicateClass = classes.find((c, i) => 
            i !== index && 
            c.name.toLowerCase() === classData.name.toLowerCase() && 
            c.grade === classData.grade
        );
        
        if (duplicateClass) {
            showNotification('Another class with this name and grade already exists!', 'error');
            return;
        }
        
        classes[index] = { ...classes[index], ...classData };
        saveToLocalStorage();
        
        showNotification(`Class "${classData.name}" updated successfully!`, 'success');
        closeModal('classModal');
        renderClassesGrid();
        populateAllSelects();
        logActivity(`Updated class: ${classData.name}`, 'info');
    }
}

function renderClassesGrid() {
    const grid = document.getElementById('classesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (classes.length === 0) {
        document.getElementById('emptyClasses').style.display = 'flex';
        return;
    }
    
    document.getElementById('emptyClasses').style.display = 'none';
    
    classes.forEach(cls => {
        const classStudents = students.filter(s => s.classId === cls.id);
        const classSubjects = subjects.filter(s => s.classId === cls.id);
        
        // Calculate class average
        let classAverage = 0;
        let gradedStudents = 0;
        
        classStudents.forEach(student => {
            const studentMarks = marks[student.id];
            if (studentMarks && studentMarks._meta && studentMarks._meta.percentage) {
                classAverage += studentMarks._meta.percentage;
                gradedStudents++;
            }
        });
        
        if (gradedStudents > 0) {
            classAverage = classAverage / gradedStudents;
        }
        
        const card = document.createElement('div');
        card.className = 'class-card';
        card.innerHTML = `
            <div class="class-header">
                <div class="class-title">
                    <h3>${cls.name}</h3>
                    <div class="class-subtitle">
                        <span>Grade ${cls.grade}</span>
                        <span>•</span>
                        <span>${cls.teacher}</span>
                    </div>
                </div>
                <div class="class-average ${getScoreClass(classAverage)}">
                    ${classAverage > 0 ? classAverage.toFixed(1) + '%' : 'No data'}
                </div>
            </div>
            
            <div class="class-stats">
                <div class="class-stat">
                    <div class="class-stat-value">${classStudents.length}</div>
                    <div class="class-stat-label">Students</div>
                </div>
                <div class="class-stat">
                    <div class="class-stat-value">${classSubjects.length}</div>
                    <div class="class-stat-label">Subjects</div>
                </div>
                <div class="class-stat">
                    <div class="class-stat-value">${gradedStudents}</div>
                    <div class="class-stat-label">Graded</div>
                </div>
                <div class="class-stat">
                    <div class="class-stat-value">${cls.academicYear.split('-')[0]}</div>
                    <div class="class-stat-label">Year</div>
                </div>
            </div>
            
            ${cls.description ? `
                <div class="class-description">
                    <p>${cls.description}</p>
                </div>
            ` : ''}
            
            <div class="class-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${gradedStudents > 0 ? (gradedStudents / classStudents.length) * 100 : 0}%"></div>
                </div>
                <span class="progress-text">${gradedStudents}/${classStudents.length} graded</span>
            </div>
            
            <div class="class-actions">
                <button class="btn btn-outline btn-sm" onclick="viewClassDetails('${cls.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-primary btn-sm" onclick="editClass('${cls.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="showDeleteConfirmation('class', '${cls.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function editClass(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    document.getElementById('classModalTitle').textContent = 'Edit Class';
    document.getElementById('classSubmitText').textContent = 'Update Class';
    document.getElementById('editClassId').value = cls.id;
    document.getElementById('className').value = cls.name;
    document.getElementById('classTeacher').value = cls.teacher;
    document.getElementById('classGrade').value = cls.grade;
    document.getElementById('academicYear').value = cls.academicYear;
    document.getElementById('classDescription').value = cls.description || '';
    document.getElementById('classColor').value = cls.color || '#6366f1';
    
    openModal('classModal');
}

function viewClassDetails(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    const classStudents = students.filter(s => s.classId === classId);
    const classSubjects = subjects.filter(s => s.classId === classId);
    
    let html = `
        <h3>${cls.name} - Grade ${cls.grade}</h3>
        <p><strong>Teacher:</strong> ${cls.teacher}</p>
        <p><strong>Academic Year:</strong> ${cls.academicYear}</p>
        ${cls.description ? `<p><strong>Description:</strong> ${cls.description}</p>` : ''}
        <hr>
        <p><strong>Students:</strong> ${classStudents.length}</p>
        <p><strong>Subjects:</strong> ${classSubjects.length}</p>
    `;
    
    if (classStudents.length > 0) {
        html += `<hr><h4>Student List:</h4><ul>`;
        classStudents.forEach(student => {
            html += `<li>${student.name} (${student.id})</li>`;
        });
        html += `</ul>`;
    }
    
    // Create a modal for viewing class details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-chalkboard-teacher"></i> Class Details</h2>
                <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                ${html}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="switchTab('students-tab'); this.closest('.modal').remove()">
                    View All Students
                </button>
                <button class="btn btn-outline" onclick="this.closest('.modal').remove()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// ====== STUDENT MANAGEMENT ======
function showAddStudentModal() {
    document.getElementById('studentModalTitle').textContent = 'Add Student';
    document.getElementById('studentSubmitText').textContent = 'Add Student';
    document.getElementById('editStudentId').value = '';
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = 'STU' + Date.now().toString().slice(-6);
    populateClassSelect('studentClass');
    openModal('studentModal');
}

function handleStudentForm(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('editStudentId').value;
    
    if (studentId) {
        updateStudent(studentId);
    } else {
        createStudent();
    }
}

function createStudent() {
    const studentData = {
        id: document.getElementById('studentId').value.trim() || 'STU' + Date.now().toString().slice(-6),
        name: document.getElementById('studentName').value.trim(),
        school: document.getElementById('schoolName').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        parent: document.getElementById('parentName').value.trim(),
        phone: document.getElementById('phoneNumber').value.trim(),
        dob: document.getElementById('studentDOB').value,
        gender: document.getElementById('studentGender').value,
        classId: document.getElementById('studentClass').value,
        address: document.getElementById('studentAddress').value.trim(),
        parentPhone: document.getElementById('parentPhone').value.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Validate
    if (!studentData.name || !studentData.school || !studentData.parent || 
        !studentData.phone || !studentData.classId) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Validate phone number
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(studentData.phone)) {
        showNotification('Please enter a valid phone number!', 'error');
        return;
    }
    
    // Check if student ID already exists
    if (students.some(s => s.id === studentData.id)) {
        showNotification('Student ID already exists! Please use a different ID.', 'error');
        return;
    }
    
    // Check if class exists
    const selectedClass = classes.find(c => c.id === studentData.classId);
    if (!selectedClass) {
        showNotification('Selected class does not exist!', 'error');
        return;
    }
    
    students.push(studentData);
    
    // Update class student count
    selectedClass.studentCount = (selectedClass.studentCount || 0) + 1;
    selectedClass.updatedAt = new Date().toISOString();
    
    saveToLocalStorage();
    
    showNotification(`Student ${studentData.name} added successfully!`, 'success');
    closeModal('studentModal');
    updateDashboard();
    loadRecentStudents();
    loadStudentsTable();
    renderClassesGrid();
    logActivity(`Added student: ${studentData.name}`, 'success');
}

function updateStudent(studentId) {
    const studentData = {
        name: document.getElementById('studentName').value.trim(),
        school: document.getElementById('schoolName').value.trim(),
        email: document.getElementById('studentEmail').value.trim(),
        parent: document.getElementById('parentName').value.trim(),
        phone: document.getElementById('phoneNumber').value.trim(),
        dob: document.getElementById('studentDOB').value,
        gender: document.getElementById('studentGender').value,
        classId: document.getElementById('studentClass').value,
        address: document.getElementById('studentAddress').value.trim(),
        parentPhone: document.getElementById('parentPhone').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate
    if (!studentData.name || !studentData.school || !studentData.parent || 
        !studentData.phone || !studentData.classId) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    const index = students.findIndex(s => s.id === studentId);
    if (index !== -1) {
        const oldClassId = students[index].classId;
        const newClassId = studentData.classId;
        
        // Update class counts if class changed
        if (oldClassId !== newClassId) {
            const oldClass = classes.find(c => c.id === oldClassId);
            const newClass = classes.find(c => c.id === newClassId);
            
            if (oldClass) {
                oldClass.studentCount = Math.max(0, (oldClass.studentCount || 1) - 1);
                oldClass.updatedAt = new Date().toISOString();
            }
            
            if (newClass) {
                newClass.studentCount = (newClass.studentCount || 0) + 1;
                newClass.updatedAt = new Date().toISOString();
            }
        }
        
        students[index] = { ...students[index], ...studentData };
        saveToLocalStorage();
        
        showNotification(`Student ${studentData.name} updated successfully!`, 'success');
        closeModal('studentModal');
        updateDashboard();
        loadStudentsTable();
        renderClassesGrid();
        logActivity(`Updated student: ${studentData.name}`, 'info');
    }
}

function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById('studentModalTitle').textContent = 'Edit Student';
    document.getElementById('studentSubmitText').textContent = 'Update Student';
    document.getElementById('editStudentId').value = student.id;
    
    // Populate form with student data
    document.getElementById('studentId').value = student.id;
    document.getElementById('studentName').value = student.name;
    document.getElementById('schoolName').value = student.school;
    document.getElementById('studentEmail').value = student.email || '';
    document.getElementById('parentName').value = student.parent;
    document.getElementById('phoneNumber').value = student.phone;
    document.getElementById('studentDOB').value = student.dob || '';
    document.getElementById('studentGender').value = student.gender || '';
    document.getElementById('studentClass').value = student.classId;
    document.getElementById('studentAddress').value = student.address || '';
    document.getElementById('parentPhone').value = student.parentPhone || '';
    
    populateClassSelect('studentClass');
    
    openModal('studentModal');
}

function loadStudentsTable() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center" style="padding: 40px;">
                    <i class="fas fa-users-slash" style="font-size: 2rem; color: var(--text-light); margin-bottom: 10px;"></i>
                    <p style="color: var(--text-secondary);">No students found. Add your first student!</p>
                </td>
            </tr>
        `;
        updateStudentPagination();
        return;
    }
    
    // Filter students if search is active
    let filteredStudents = students;
    const searchTerm = document.getElementById('searchStudents')?.value.toLowerCase() || '';
    if (searchTerm) {
        filteredStudents = students.filter(student =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.school.toLowerCase().includes(searchTerm) ||
            student.email?.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.parent.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply class filter
    const classFilter = document.getElementById('filterClass')?.value;
    if (classFilter) {
        filteredStudents = filteredStudents.filter(s => s.classId === classFilter);
    }
    
    // Apply status filter
    const statusFilter = document.getElementById('filterStatus')?.value;
    if (statusFilter) {
        filteredStudents = filteredStudents.filter(s => s.status === statusFilter);
    }
    
    // Calculate pagination
    const startIndex = (currentStudentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
    
    paginatedStudents.forEach((student, index) => {
        const studentClass = classes.find(c => c.id === student.classId);
        const studentMarks = marks[student.id] || {};
        const meta = studentMarks._meta || {};
        const hasMarks = meta.percentage > 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-center">${startIndex + index + 1}</td>
            <td>
                <div class="student-cell">
                    <div class="student-avatar xs">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>${student.school}</small>
                    </div>
                </div>
            </td>
            <td>${student.id}</td>
            <td>${studentClass ? studentClass.name : 'N/A'}</td>
            <td>${formatPhone(student.phone)}</td>
            <td>${student.parent}</td>
            <td>
                <span class="status-badge ${student.status}">${student.status}</span>
            </td>
            <td>
                ${hasMarks ? 
                    `<span class="grade-display ${getGradeClass(meta.grade)}">${meta.grade} (${meta.percentage.toFixed(1)}%)</span>` : 
                    '-'
                }
            </td>
            <td class="text-center">
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editStudent('${student.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn report" onclick="generateStudentReport('${student.id}')" title="Report">
                        <i class="fas fa-file-alt"></i>
                    </button>
                    <button class="action-btn marks" onclick="enterStudentMarks('${student.id}')" title="${hasMarks ? 'Edit Marks' : 'Enter Marks'}">
                        <i class="fas ${hasMarks ? 'fa-edit' : 'fa-plus'}"></i>
                    </button>
                    <button class="action-btn delete" onclick="showDeleteConfirmation('student', '${student.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateStudentPagination(filteredStudents.length);
}

function updateStudentPagination(totalItems = students.length) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const currentPageEl = document.getElementById('currentPage');
    const totalPagesEl = document.getElementById('totalPages');
    const showingCountEl = document.getElementById('showingCount');
    const totalCountEl = document.getElementById('totalCount');
    
    if (currentPageEl) currentPageEl.textContent = currentStudentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
    if (showingCountEl) showingCountEl.textContent = Math.min(itemsPerPage, totalItems - (currentStudentPage - 1) * itemsPerPage);
    if (totalCountEl) totalCountEl.textContent = totalItems;
}

function prevPage() {
    if (currentStudentPage > 1) {
        currentStudentPage--;
        loadStudentsTable();
    }
}

function nextPage() {
    const totalItems = students.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentStudentPage < totalPages) {
        currentStudentPage++;
        loadStudentsTable();
    }
}

function filterStudents() {
    currentStudentPage = 1;
    loadStudentsTable();
}

function clearStudentSearch() {
    const searchInput = document.getElementById('searchStudents');
    if (searchInput) {
        searchInput.value = '';
        filterStudents();
    }
}

function enterStudentMarks(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Switch to marks tab and select the student's class
    switchTab('marks-tab');
    
    // Set the class in the marks dropdown
    const classSelect = document.getElementById('marksClassSelect');
    if (classSelect) {
        classSelect.value = student.classId;
        loadClassStudents();
        
        // After a short delay, focus on the student's marks input
        setTimeout(() => {
            const markInput = document.getElementById(`mark_${studentId}`);
            if (markInput) {
                markInput.focus();
            }
        }, 500);
    }
    
    showNotification(`Now entering marks for ${student.name}`, 'info');
}

// ====== SUBJECT MANAGEMENT ======
function showCreateSubjectModal() {
    document.getElementById('subjectModalTitle').textContent = 'Add Subject';
    document.getElementById('subjectSubmitText').textContent = 'Add Subject';
    document.getElementById('editSubjectId').value = '';
    document.getElementById('subjectForm').reset();
    document.getElementById('subjectColor').value = '#6366f1';
    document.getElementById('subjectMaxMarks').value = '100';
    document.getElementById('subjectPassMarks').value = '40';
    populateClassSelect('subjectClass');
    openModal('subjectModal');
}

function handleSubjectForm(e) {
    e.preventDefault();
    
    const subjectId = document.getElementById('editSubjectId').value;
    
    if (subjectId) {
        updateSubject(subjectId);
    } else {
        createSubject();
    }
}

function createSubject() {
    const subjectData = {
        id: 'SUB' + Date.now().toString().slice(-6),
        name: document.getElementById('subjectName').value.trim(),
        classId: document.getElementById('subjectClass').value,
        maxMarks: parseInt(document.getElementById('subjectMaxMarks').value),
        passMarks: parseInt(document.getElementById('subjectPassMarks').value) || 40,
        color: document.getElementById('subjectColor').value,
        teacher: document.getElementById('subjectTeacher').value.trim(),
        description: document.getElementById('subjectDescription').value.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
    };
    
    // Validate
    if (!subjectData.name || !subjectData.classId) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    if (subjectData.maxMarks <= 0 || subjectData.maxMarks > 200) {
        showNotification('Maximum marks must be between 1 and 200', 'error');
        return;
    }
    
    if (subjectData.passMarks > subjectData.maxMarks) {
        showNotification('Pass marks cannot exceed maximum marks', 'error');
        return;
    }
    
    // Check if subject with same name already exists in this class
    const existingSubject = subjects.find(s => 
        s.name.toLowerCase() === subjectData.name.toLowerCase() && 
        s.classId === subjectData.classId
    );
    
    if (existingSubject) {
        showNotification('This subject already exists in the selected class!', 'error');
        return;
    }
    
    subjects.push(subjectData);
    saveToLocalStorage();
    
    showNotification(`Subject "${subjectData.name}" created successfully!`, 'success');
    closeModal('subjectModal');
    loadSubjectsList();
    logActivity(`Created new subject: ${subjectData.name}`, 'success');
}

function updateSubject(subjectId) {
    const subjectData = {
        name: document.getElementById('subjectName').value.trim(),
        classId: document.getElementById('subjectClass').value,
        maxMarks: parseInt(document.getElementById('subjectMaxMarks').value),
        passMarks: parseInt(document.getElementById('subjectPassMarks').value) || 40,
        color: document.getElementById('subjectColor').value,
        teacher: document.getElementById('subjectTeacher').value.trim(),
        description: document.getElementById('subjectDescription').value.trim(),
        updatedAt: new Date().toISOString()
    };
    
    // Validate
    if (!subjectData.name || !subjectData.classId) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    if (subjectData.maxMarks <= 0 || subjectData.maxMarks > 200) {
        showNotification('Maximum marks must be between 1 and 200', 'error');
        return;
    }
    
    if (subjectData.passMarks > subjectData.maxMarks) {
        showNotification('Pass marks cannot exceed maximum marks', 'error');
        return;
    }
    
    const index = subjects.findIndex(s => s.id === subjectId);
    if (index !== -1) {
        // Check if another subject has the same name in the same class
        const duplicateSubject = subjects.find((s, i) => 
            i !== index && 
            s.name.toLowerCase() === subjectData.name.toLowerCase() && 
            s.classId === subjectData.classId
        );
        
        if (duplicateSubject) {
            showNotification('Another subject with this name already exists in the selected class!', 'error');
            return;
        }
        
        subjects[index] = { ...subjects[index], ...subjectData };
        saveToLocalStorage();
        
        showNotification(`Subject "${subjectData.name}" updated successfully!`, 'success');
        closeModal('subjectModal');
        loadSubjectsList();
        logActivity(`Updated subject: ${subjectData.name}`, 'info');
    }
}

function loadSubjectsList() {
    const container = document.getElementById('subjectsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (subjects.length === 0) {
        document.getElementById('totalSubjects').textContent = '0 subjects';
        container.innerHTML = '<p class="empty-text">No subjects found. Add your first subject!</p>';
        return;
    }
    
    document.getElementById('totalSubjects').textContent = `${subjects.length} subjects`;
    
    // Group subjects by class
    const subjectsByClass = {};
    subjects.forEach(subject => {
        if (!subjectsByClass[subject.classId]) {
            subjectsByClass[subject.classId] = [];
        }
        subjectsByClass[subject.classId].push(subject);
    });
    
    Object.keys(subjectsByClass).forEach(classId => {
        const cls = classes.find(c => c.id === classId);
        if (!cls) return;
        
        const classHeader = document.createElement('div');
        classHeader.className = 'subject-group-header';
        classHeader.innerHTML = `
            <div class="group-title">
                <h4>${cls.name}</h4>
                <small>Grade ${cls.grade} • ${cls.teacher}</small>
            </div>
            <span class="badge">${subjectsByClass[classId].length} subjects</span>
        `;
        container.appendChild(classHeader);
        
        subjectsByClass[classId].forEach(subject => {
            const subjectElement = document.createElement('div');
            subjectElement.className = 'subject-item';
            subjectElement.innerHTML = `
                <div class="subject-info">
                    <div class="subject-color" style="background: ${subject.color}"></div>
                    <div class="subject-details">
                        <h4>${subject.name}</h4>
                        <div class="subject-meta">
                            <small><i class="fas fa-chalkboard"></i> ${cls.name}</small>
                            <small><i class="fas fa-percentage"></i> Max: ${subject.maxMarks}</small>
                            <small><i class="fas fa-calendar"></i> ${formatDate(subject.updatedAt)}</small>
                        </div>
                    </div>
                </div>
                <div class="subject-actions">
                    <button class="btn btn-outline btn-sm" onclick="editSubject('${subject.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="showDeleteConfirmation('subject', '${subject.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(subjectElement);
        });
    });
    
    updateSubjectStats();
}

function editSubject(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    document.getElementById('subjectModalTitle').textContent = 'Edit Subject';
    document.getElementById('subjectSubmitText').textContent = 'Update Subject';
    document.getElementById('editSubjectId').value = subject.id;
    
    document.getElementById('subjectName').value = subject.name;
    document.getElementById('subjectClass').value = subject.classId;
    document.getElementById('subjectMaxMarks').value = subject.maxMarks;
    document.getElementById('subjectPassMarks').value = subject.passMarks || 40;
    document.getElementById('subjectColor').value = subject.color;
    document.getElementById('subjectTeacher').value = subject.teacher || '';
    document.getElementById('subjectDescription').value = subject.description || '';
    
    populateClassSelect('subjectClass');
    
    openModal('subjectModal');
}

function updateSubjectStats() {
    const container = document.getElementById('subjectStats');
    if (!container) return;
    
    // Calculate statistics
    const totalSubjects = subjects.length;
    const subjectsWithStudents = subjects.filter(subject => {
        const classStudents = students.filter(s => s.classId === subject.classId);
        return classStudents.length > 0;
    }).length;
    
    const subjectsWithMarks = subjects.filter(subject => {
        const classStudents = students.filter(s => s.classId === subject.classId);
        return classStudents.some(student => {
            const studentMarks = marks[student.id];
            return studentMarks && studentMarks[subject.name];
        });
    }).length;
    
    container.innerHTML = `
        <div class="subject-stat">
            <div class="class-stat-value">${totalSubjects}</div>
            <div class="class-stat-label">Total Subjects</div>
        </div>
        <div class="subject-stat">
            <div class="class-stat-value">${subjectsWithStudents}</div>
            <div class="class-stat-label">Active Subjects</div>
        </div>
        <div class="subject-stat">
            <div class="class-stat-value">${subjectsWithMarks}</div>
            <div class="class-stat-label">With Marks</div>
        </div>
    `;
    
    // Update subject distribution chart
    updateSubjectDistributionChart();
}

// ====== MARKS MANAGEMENT ======
function populateMarksSelects() {
    populateClassSelect('marksClassSelect');
    
    // Clear subject select
    const subjectSelect = document.getElementById('marksSubjectSelect');
    if (subjectSelect) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
    }
}

function loadClassStudents() {
    const classId = document.getElementById('marksClassSelect').value;
    const subjectSelect = document.getElementById('marksSubjectSelect');
    
    if (!classId) {
        if (subjectSelect) {
            subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        }
        document.getElementById('marksTitle').textContent = 'Select Class and Subject';
        document.getElementById('marksSubtitle').textContent = 'Choose a class and subject to enter marks';
        return;
    }
    
    // Populate subjects for this class
    const classSubjects = subjects.filter(s => s.classId === classId);
    if (subjectSelect) {
        subjectSelect.innerHTML = '<option value="">Select Subject</option>';
        classSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectSelect.appendChild(option);
        });
    }
    
    // Load marks table
    loadSubjectMarks();
}

function loadSubjectMarks() {
    const classId = document.getElementById('marksClassSelect').value;
    const subjectId = document.getElementById('marksSubjectSelect').value;
    const examType = document.getElementById('marksExamType').value;
    
    const tbody = document.getElementById('marksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (!classId || !subjectId) {
        document.getElementById('marksTitle').textContent = 'Select Class and Subject';
        document.getElementById('marksSubtitle').textContent = 'Choose a class and subject to enter marks';
        document.getElementById('marksStudentCount').textContent = '0';
        document.getElementById('marksClassAverage').textContent = '0%';
        document.getElementById('marksTopScore').textContent = '0';
        document.getElementById('marksPerformance').textContent = 'Good';
        return;
    }
    
    const cls = classes.find(c => c.id === classId);
    const subject = subjects.find(s => s.id === subjectId);
    
    if (!cls || !subject) return;
    
    document.getElementById('marksTitle').textContent = `Enter Marks - ${subject.name}`;
    document.getElementById('marksSubtitle').textContent = `${cls.name} • Maximum Marks: ${subject.maxMarks} • Exam: ${examType.replace('term', 'Term ').replace('final', 'Final Exam')}`;
    
    const classStudents = students.filter(s => s.classId === classId);
    document.getElementById('marksStudentCount').textContent = classStudents.length;
    
    let totalMarks = 0;
    let count = 0;
    let topScore = 0;
    
    classStudents.forEach((student, index) => {
        // Get existing marks if any
        const studentMarks = marks[student.id] || {};
        const subjectMarks = studentMarks[subject.name] || {};
        const existingMark = subjectMarks[examType] || '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="student-cell">
                    <div class="student-avatar xs">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>${student.school}</small>
                    </div>
                </div>
            </td>
            <td>${student.id}</td>
            <td>
                <input type="number" 
                       class="mark-input" 
                       id="mark_${student.id}" 
                       min="0" 
                       max="${subject.maxMarks}" 
                       step="0.5" 
                       placeholder="Enter marks"
                       value="${existingMark}"
                       onchange="updateMarksSummary()"
                       oninput="updateStudentMark('${student.id}', '${subject.name}', '${examType}', this.value)">
            </td>
            <td>${subject.maxMarks}</td>
            <td id="percentage_${student.id}">${existingMark ? ((existingMark / subject.maxMarks) * 100).toFixed(1) + '%' : '0%'}</td>
            <td id="grade_${student.id}">${existingMark ? getGradeFromPercentage((existingMark / subject.maxMarks) * 100) : '-'}</td>
            <td id="remarks_${student.id}">${existingMark ? getSubjectRemarks((existingMark / subject.maxMarks) * 100) : '-'}</td>
        `;
        tbody.appendChild(row);
        
        // Update summary if there's an existing mark
        if (existingMark) {
            const mark = parseFloat(existingMark);
            if (!isNaN(mark)) {
                totalMarks += mark;
                count++;
                
                if (mark > topScore) topScore = mark;
                
                const percentage = (mark / subject.maxMarks) * 100;
                const grade = getGradeFromPercentage(percentage);
                
                document.getElementById(`percentage_${student.id}`).textContent = percentage.toFixed(1) + '%';
                document.getElementById(`grade_${student.id}`).textContent = grade;
                document.getElementById(`grade_${student.id}`).className = getGradeClass(grade);
                document.getElementById(`remarks_${student.id}`).textContent = getSubjectRemarks(percentage);
            }
        }
    });
    
    updateMarksSummary();
}

function updateStudentMark(studentId, subjectName, examType, value) {
    if (!studentId || !subjectName || !examType) return;
    
    // Initialize marks object for student if it doesn't exist
    if (!marks[studentId]) {
        marks[studentId] = {};
    }
    
    if (!marks[studentId][subjectName]) {
        marks[studentId][subjectName] = {};
    }
    
    // Store the mark
    const mark = parseFloat(value);
    if (!isNaN(mark) && mark >= 0) {
        marks[studentId][subjectName][examType] = mark;
        
        // Recalculate average for the subject
        const subjectMarks = marks[studentId][subjectName];
        const examTypes = ['term1', 'term2', 'term3', 'final'];
        let total = 0;
        let count = 0;
        
        examTypes.forEach(type => {
            if (subjectMarks[type]) {
                total += subjectMarks[type];
                count++;
            }
        });
        
        if (count > 0) {
            marks[studentId][subjectName].average = total / count;
        }
        
        // Update student's overall meta data
        updateStudentMetaData(studentId);
        saveToLocalStorage();
    }
}

function updateStudentMetaData(studentId) {
    const studentMarks = marks[studentId];
    if (!studentMarks) return;
    
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const studentSubjects = subjects.filter(s => s.classId === student.classId);
    let totalObtained = 0;
    let totalPossible = 0;
    
    studentSubjects.forEach(subject => {
        const subjectMarks = studentMarks[subject.name];
        if (subjectMarks && subjectMarks.average) {
            totalObtained += subjectMarks.average;
            totalPossible += subject.maxMarks;
        }
    });
    
    if (totalPossible > 0) {
        const percentage = (totalObtained / totalPossible) * 100;
        const grade = getGradeFromPercentage(percentage);
        
        marks[studentId]._meta = {
            totalObtained: totalObtained,
            totalPossible: totalPossible,
            percentage: percentage,
            grade: grade,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // Update student ranks
    updateStudentRanks(student.classId);
}

function updateStudentRanks(classId) {
    const classStudents = students.filter(s => s.classId === classId);
    const studentsWithMarks = classStudents.filter(s => marks[s.id] && marks[s.id]._meta);
    
    // Sort by percentage descending
    studentsWithMarks.sort((a, b) => {
        const marksA = marks[a.id]._meta.percentage;
        const marksB = marks[b.id]._meta.percentage;
        return marksB - marksA;
    });
    
    // Assign ranks
    studentsWithMarks.forEach((student, index) => {
        if (marks[student.id] && marks[student.id]._meta) {
            marks[student.id]._meta.rank = index + 1;
        }
    });
}

function updateMarksSummary() {
    const classId = document.getElementById('marksClassSelect').value;
    const subjectId = document.getElementById('marksSubjectSelect').value;
    
    if (!classId || !subjectId) return;
    
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const classStudents = students.filter(s => s.classId === classId);
    
    let totalMarks = 0;
    let count = 0;
    let topScore = 0;
    let passedCount = 0;
    
    classStudents.forEach(student => {
        const input = document.getElementById(`mark_${student.id}`);
        if (input && input.value) {
            const mark = parseFloat(input.value);
            if (!isNaN(mark)) {
                totalMarks += mark;
                count++;
                
                if (mark > topScore) topScore = mark;
                if (mark >= (subject.passMarks || 40)) passedCount++;
                
                const percentage = (mark / subject.maxMarks) * 100;
                const grade = getGradeFromPercentage(percentage);
                
                document.getElementById(`percentage_${student.id}`).textContent = percentage.toFixed(1) + '%';
                document.getElementById(`grade_${student.id}`).textContent = grade;
                document.getElementById(`grade_${student.id}`).className = getGradeClass(grade);
                document.getElementById(`remarks_${student.id}`).textContent = getSubjectRemarks(percentage);
            }
        }
    });
    
    const average = count > 0 ? (totalMarks / count) : 0;
    const averagePercentage = (average / subject.maxMarks) * 100;
    const passRate = count > 0 ? (passedCount / count) * 100 : 0;
    
    document.getElementById('marksClassAverage').textContent = averagePercentage.toFixed(1) + '%';
    document.getElementById('marksTopScore').textContent = topScore;
    
    let performance = 'Good';
    if (passRate >= 80) performance = 'Excellent';
    else if (passRate >= 60) performance = 'Good';
    else if (passRate >= 40) performance = 'Average';
    else performance = 'Needs Improvement';
    
    document.getElementById('marksPerformance').textContent = performance;
}

function saveAllMarks() {
    const classId = document.getElementById('marksClassSelect').value;
    const subjectId = document.getElementById('marksSubjectSelect').value;
    const examType = document.getElementById('marksExamType').value;
    
    if (!classId || !subjectId) {
        showNotification('Please select a class and subject first', 'error');
        return;
    }
    
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    const classStudents = students.filter(s => s.classId === classId);
    
    let savedCount = 0;
    let errors = [];
    
    classStudents.forEach(student => {
        const input = document.getElementById(`mark_${student.id}`);
        if (input && input.value) {
            const mark = parseFloat(input.value);
            if (!isNaN(mark) && mark >= 0 && mark <= subject.maxMarks) {
                updateStudentMark(student.id, subject.name, examType, mark);
                savedCount++;
            } else if (mark > subject.maxMarks) {
                errors.push(`${student.name}: Marks (${mark}) exceed maximum (${subject.maxMarks})`);
            }
        }
    });
    
    saveToLocalStorage();
    
    if (errors.length > 0) {
        showNotification(`Saved ${savedCount} marks. Errors: ${errors.join('; ')}`, 'warning');
    } else if (savedCount > 0) {
        showNotification(`Saved marks for ${savedCount} students`, 'success');
        logActivity(`Saved marks for ${savedCount} students in ${subject.name}`, 'success');
    } else {
        showNotification('No valid marks to save', 'warning');
    }
    
    // Update dashboard and charts
    updateDashboard();
    updatePerformanceChart();
    loadTopPerformers();
}

function calculateClassAverage() {
    updateMarksSummary();
    showNotification('Class average calculated', 'info');
}

// ====== REPORTS ======
function loadReports() {
    // Update class select for reports
    populateClassSelect('reportClassSelect');
    
    // Load student reports by default
    showReportType('student');
}

function filterReports() {
    const classId = document.getElementById('reportClassSelect').value;
    const reportType = document.getElementById('reportType').value;
    
    // Update the active report type
    showReportType(reportType, classId);
}

function showReportType(type, classId = null) {
    if (!classId) {
        classId = document.getElementById('reportClassSelect')?.value || '';
    }
    
    // Update active button
    document.querySelectorAll('.report-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.report-type-btn[onclick*="'${type}'"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Show/hide report sections
    document.querySelectorAll('.reports-list').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(`${type}Reports`);
    if (targetSection) {
        targetSection.style.display = 'grid';
        generateReports(type, classId);
    }
}

function generateReports(type, classId = '') {
    let container;
    
    switch(type) {
        case 'student':
            container = document.getElementById('studentReports');
            generateStudentReports(classId);
            break;
        case 'class':
            container = document.getElementById('classReports');
            generateClassReports(classId);
            break;
        case 'subject':
            container = document.getElementById('subjectReports');
            generateSubjectReports(classId);
            break;
        case 'term':
            container = document.getElementById('termReports');
            generateTermReports(classId);
            break;
    }
}

function generateStudentReports(classId = '') {
    const container = document.getElementById('studentReports');
    if (!container) return;
    
    let filteredStudents = students;
    if (classId) {
        filteredStudents = students.filter(s => s.classId === classId);
    }
    
    if (filteredStudents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-graduate"></i>
                <h3>No Students Found</h3>
                <p>${classId ? 'No students in selected class' : 'No students in the system'}</p>
            </div>
        `;
        return;
    }
    
    // Filter students with marks
    const studentsWithMarks = filteredStudents.filter(student => {
        const studentMarks = marks[student.id];
        return studentMarks && studentMarks._meta && studentMarks._meta.percentage > 0;
    });
    
    if (studentsWithMarks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <h3>No Reports Available</h3>
                <p>No students have marks recorded yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = studentsWithMarks.map(student => {
        const studentClass = classes.find(c => c.id === student.classId);
        const studentMarks = marks[student.id];
        const meta = studentMarks._meta;
        
        return `
            <div class="report-card">
                <div class="report-header">
                    <div class="report-title">
                        <h3>${student.name}</h3>
                        <div class="report-subtitle">
                            <span>${studentClass ? studentClass.name : 'N/A'}</span>
                            <span>•</span>
                            <span>ID: ${student.id}</span>
                        </div>
                    </div>
                    <div class="report-position">
                        <span class="position-number">${meta.rank || 'N/A'}</span>
                        <small>Rank</small>
                    </div>
                </div>
                
                <div class="report-stats">
                    <div class="stat">
                        <span class="stat-label">Overall Score</span>
                        <span class="stat-value">${meta.percentage.toFixed(1)}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Grade</span>
                        <span class="grade ${getGradeClass(meta.grade)}">${meta.grade}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Marks</span>
                        <span class="stat-value">${meta.totalObtained.toFixed(1)}/${meta.totalPossible}</span>
                    </div>
                </div>
                
                <div class="subject-breakdown">
                    <h4>Subject Performance</h4>
                    <div class="subject-list">
                        ${Object.keys(studentMarks).filter(key => key !== '_meta').map(subjectName => {
                            const subjectData = studentMarks[subjectName];
                            const percentage = subjectData.average ? (subjectData.average / 100) * 100 : 0;
                            return `
                                <div class="subject-score">
                                    <span class="subject-name">${subjectName}</span>
                                    <span class="subject-percentage">${percentage.toFixed(1)}%</span>
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="report-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewDetailedReport('${student.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="downloadStudentReport('${student.id}')">
                        <i class="fas fa-download"></i> Download PDF
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generateClassReports(classId = '') {
    const container = document.getElementById('classReports');
    if (!container) return;
    
    let filteredClasses = classes;
    if (classId) {
        filteredClasses = classes.filter(c => c.id === classId);
    }
    
    if (filteredClasses.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chalkboard-teacher"></i>
                <h3>No Classes Found</h3>
                <p>${classId ? 'Selected class not found' : 'No classes in the system'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredClasses.map(cls => {
        const classStudents = students.filter(s => s.classId === cls.id);
        const classSubjects = subjects.filter(s => s.classId === cls.id);
        
        // Calculate class statistics
        let classAverage = 0;
        let gradedStudents = 0;
        let topStudent = null;
        let topScore = 0;
        
        classStudents.forEach(student => {
            const studentMarks = marks[student.id];
            if (studentMarks && studentMarks._meta && studentMarks._meta.percentage) {
                const percentage = studentMarks._meta.percentage;
                classAverage += percentage;
                gradedStudents++;
                
                if (percentage > topScore) {
                    topScore = percentage;
                    topStudent = student;
                }
            }
        });
        
        if (gradedStudents > 0) {
            classAverage = classAverage / gradedStudents;
        }
        
        return `
            <div class="report-card">
                <div class="report-header">
                    <div class="report-title">
                        <h3>${cls.name}</h3>
                        <div class="report-subtitle">
                            <span>Grade ${cls.grade}</span>
                            <span>•</span>
                            <span>${cls.teacher}</span>
                        </div>
                    </div>
                    <div class="report-position">
                        <span class="position-number">${gradedStudents}</span>
                        <small>Graded</small>
                    </div>
                </div>
                
                <div class="report-stats">
                    <div class="stat">
                        <span class="stat-label">Class Average</span>
                        <span class="stat-value">${classAverage.toFixed(1)}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Students</span>
                        <span class="stat-value">${classStudents.length}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Subjects</span>
                        <span class="stat-value">${classSubjects.length}</span>
                    </div>
                </div>
                
                <div class="performance-summary">
                    <h4>Performance Summary</h4>
                    <p>${gradedStudents}/${classStudents.length} students graded (${classStudents.length > 0 ? Math.round((gradedStudents / classStudents.length) * 100) : 0}%)</p>
                    ${topStudent ? `<p><strong>Top Performer:</strong> ${topStudent.name} (${topScore.toFixed(1)}%)</p>` : ''}
                </div>
                
                <div class="report-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewClassReport('${cls.id}')">
                        <i class="fas fa-chart-bar"></i> View Analytics
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="downloadClassReport('${cls.id}')">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generateSubjectReports(classId = '') {
    const container = document.getElementById('subjectReports');
    if (!container) return;
    
    let filteredSubjects = subjects;
    if (classId) {
        filteredSubjects = subjects.filter(s => s.classId === classId);
    }
    
    if (filteredSubjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book"></i>
                <h3>No Subjects Found</h3>
                <p>${classId ? 'No subjects in selected class' : 'No subjects in the system'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredSubjects.map(subject => {
        const cls = classes.find(c => c.id === subject.classId);
        const classStudents = students.filter(s => s.classId === subject.classId);
        
        // Calculate subject statistics
        let totalMarks = 0;
        let gradedStudents = 0;
        let highestMark = 0;
        let lowestMark = subject.maxMarks;
        
        classStudents.forEach(student => {
            const studentMarks = marks[student.id];
            if (studentMarks && studentMarks[subject.name] && studentMarks[subject.name].average) {
                const mark = studentMarks[subject.name].average;
                totalMarks += mark;
                gradedStudents++;
                
                if (mark > highestMark) highestMark = mark;
                if (mark < lowestMark) lowestMark = mark;
            }
        });
        
        const average = gradedStudents > 0 ? totalMarks / gradedStudents : 0;
        const averagePercentage = (average / subject.maxMarks) * 100;
        const passRate = classStudents.filter(student => {
            const studentMarks = marks[student.id];
            return studentMarks && studentMarks[subject.name] && studentMarks[subject.name].average >= subject.passMarks;
        }).length;
        
        return `
            <div class="report-card">
                <div class="report-header">
                    <div class="report-title">
                        <h3>${subject.name}</h3>
                        <div class="report-subtitle">
                            <span>${cls ? cls.name : 'N/A'}</span>
                            <span>•</span>
                            <span>Max Marks: ${subject.maxMarks}</span>
                        </div>
                    </div>
                    <div class="report-position">
                        <span class="position-number">${gradedStudents}</span>
                        <small>Graded</small>
                    </div>
                </div>
                
                <div class="report-stats">
                    <div class="stat">
                        <span class="stat-label">Average Score</span>
                        <span class="stat-value">${averagePercentage.toFixed(1)}%</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Highest</span>
                        <span class="stat-value">${highestMark.toFixed(1)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Pass Rate</span>
                        <span class="stat-value">${classStudents.length > 0 ? Math.round((passRate / classStudents.length) * 100) : 0}%</span>
                    </div>
                </div>
                
                <div class="performance-summary">
                    <h4>Subject Analysis</h4>
                    <p><strong>Teacher:</strong> ${subject.teacher || 'Not assigned'}</p>
                    <p><strong>Pass Marks:</strong> ${subject.passMarks || 40}</p>
                    <p><strong>Grading Progress:</strong> ${gradedStudents}/${classStudents.length} students</p>
                </div>
                
                <div class="report-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewSubjectReport('${subject.id}')">
                        <i class="fas fa-chart-pie"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="downloadSubjectReport('${subject.id}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generateTermReports(classId = '') {
    const container = document.getElementById('termReports');
    if (!container) return;
    
    // Get all terms with data
    const terms = ['term1', 'term2', 'term3', 'final'];
    const termData = {};
    
    terms.forEach(term => {
        let totalMarks = 0;
        let count = 0;
        
        students.forEach(student => {
            const studentMarks = marks[student.id];
            if (studentMarks) {
                Object.keys(studentMarks).forEach(subjectName => {
                    if (subjectName !== '_meta' && studentMarks[subjectName][term]) {
                        totalMarks += studentMarks[subjectName][term];
                        count++;
                    }
                });
            }
        });
        
        termData[term] = {
            average: count > 0 ? totalMarks / count : 0,
            count: count
        };
    });
    
    container.innerHTML = terms.map(term => {
        const data = termData[term];
        const termName = term.replace('term', 'Term ').replace('final', 'Final Exam');
        
        return `
            <div class="report-card">
                <div class="report-header">
                    <div class="report-title">
                        <h3>${termName}</h3>
                        <div class="report-subtitle">
                            <span>Overall Performance</span>
                        </div>
                    </div>
                    <div class="report-position">
                        <span class="position-number">${data.count}</span>
                        <small>Records</small>
                    </div>
                </div>
                
                <div class="report-stats">
                    <div class="stat">
                        <span class="stat-label">Average Marks</span>
                        <span class="stat-value">${data.average.toFixed(1)}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Performance</span>
                        <span class="stat-value ${getScoreClass((data.average / 100) * 100)}">${getSubjectRemarks((data.average / 100) * 100)}</span>
                    </div>
                </div>
                
                <div class="performance-summary">
                    <h4>Term Analysis</h4>
                    <p>${data.count} marks recorded in this term</p>
                    <p>${data.average > 70 ? 'Above average performance' : data.average > 50 ? 'Average performance' : 'Below average performance'}</p>
                </div>
                
                <div class="report-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewTermReport('${term}')">
                        <i class="fas fa-list"></i> View Details
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="downloadTermReport('${term}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function generateStudentReport(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const studentMarks = marks[studentId] || {};
    const meta = studentMarks._meta || {};
    
    if (!meta.percentage || meta.percentage === 0) {
        showNotification('No marks recorded for this student yet', 'warning');
        return;
    }
    
    // Open report modal
    document.getElementById('reportModalTitle').textContent = `Student Report - ${student.name}`;
    const reportGenerator = document.getElementById('reportGenerator');
    
    const studentClass = classes.find(c => c.id === student.classId);
    const studentSubjects = subjects.filter(s => s.classId === student.classId);
    
    let html = `
        <div class="student-report">
            <div class="report-header">
                <h3>${student.name} - Academic Report</h3>
                <div class="report-meta">
                    <p><strong>Student ID:</strong> ${student.id}</p>
                    <p><strong>Class:</strong> ${studentClass ? studentClass.name : 'N/A'}</p>
                    <p><strong>School:</strong> ${student.school}</p>
                    <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="overall-performance">
                <h4>Overall Performance</h4>
                <div class="performance-stats">
                    <div class="performance-stat">
                        <span class="stat-label">Total Percentage</span>
                        <span class="stat-value">${meta.percentage.toFixed(1)}%</span>
                    </div>
                    <div class="performance-stat">
                        <span class="stat-label">Grade</span>
                        <span class="grade ${getGradeClass(meta.grade)}">${meta.grade}</span>
                    </div>
                    <div class="performance-stat">
                        <span class="stat-label">Rank</span>
                        <span class="stat-value">${meta.rank || 'N/A'}</span>
                    </div>
                    <div class="performance-stat">
                        <span class="stat-label">Marks Obtained</span>
                        <span class="stat-value">${meta.totalObtained.toFixed(1)}/${meta.totalPossible}</span>
                    </div>
                </div>
            </div>
            
            <div class="subject-performance">
                <h4>Subject-wise Performance</h4>
                <table class="subject-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Term 1</th>
                            <th>Term 2</th>
                            <th>Term 3</th>
                            <th>Final</th>
                            <th>Average</th>
                            <th>Percentage</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    studentSubjects.forEach(subject => {
        const subjectMarks = studentMarks[subject.name] || {};
        const average = subjectMarks.average || 0;
        const percentage = (average / subject.maxMarks) * 100;
        const grade = getGradeFromPercentage(percentage);
        
        html += `
            <tr>
                <td>${subject.name}</td>
                <td>${subjectMarks.term1 || '-'}</td>
                <td>${subjectMarks.term2 || '-'}</td>
                <td>${subjectMarks.term3 || '-'}</td>
                <td>${subjectMarks.final || '-'}</td>
                <td>${average.toFixed(1)}</td>
                <td>${percentage.toFixed(1)}%</td>
                <td><span class="grade ${getGradeClass(grade)}">${grade}</span></td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
            
            <div class="report-summary">
                <h4>Summary</h4>
                <p>${getReportSummary(meta.percentage)}</p>
            </div>
            
            <div class="report-actions">
                <button class="btn btn-primary" onclick="printReport()">
                    <i class="fas fa-print"></i> Print Report
                </button>
                <button class="btn btn-success" onclick="downloadPDFReport('${studentId}')">
                    <i class="fas fa-file-pdf"></i> Download PDF
                </button>
            </div>
        </div>
    `;
    
    reportGenerator.innerHTML = html;
    openModal('reportModal');
}

function getReportSummary(percentage) {
    if (percentage >= 90) {
        return "Outstanding performance! The student has demonstrated exceptional understanding and mastery of all subjects. Consistently exceeds expectations and shows great potential for advanced studies.";
    } else if (percentage >= 80) {
        return "Excellent performance! The student shows strong understanding of concepts and consistently performs above average. Shows good analytical skills and attention to detail.";
    } else if (percentage >= 70) {
        return "Good performance! The student meets expectations and demonstrates satisfactory understanding of course material. Shows consistent effort and improvement.";
    } else if (percentage >= 60) {
        return "Average performance. The student meets basic requirements but could benefit from additional practice and focus in certain areas. Shows potential for improvement.";
    } else if (percentage >= 50) {
        return "Below average performance. The student needs additional support and practice to improve understanding. Would benefit from focused study sessions and tutoring.";
    } else {
        return "Needs significant improvement. The student is struggling with core concepts and requires immediate intervention and support to catch up with the class.";
    }
}

function viewDetailedReport(studentId) {
    generateStudentReport(studentId);
}

function downloadStudentReport(studentId) {
    showNotification('Generating PDF report... This feature requires server-side implementation.', 'info');
    // In a real application, this would generate and download a PDF
}

function viewClassReport(classId) {
    showNotification('Class report view coming soon!', 'info');
}

function downloadClassReport(classId) {
    showNotification('Class report download coming soon!', 'info');
}

function viewSubjectReport(subjectId) {
    showNotification('Subject report view coming soon!', 'info');
}

function downloadSubjectReport(subjectId) {
    showNotification('Subject report download coming soon!', 'info');
}

function viewTermReport(term) {
    showNotification('Term report view coming soon!', 'info');
}

function downloadTermReport(term) {
    showNotification('Term report download coming soon!', 'info');
}

function generateAllReports() {
    showNotification('Generating all reports...', 'info');
    // In a real implementation, this would generate PDF reports
    setTimeout(() => {
        showNotification('All reports generated successfully!', 'success');
    }, 2000);
}

function downloadPDFReport(studentId) {
    showNotification('PDF generation requires server-side implementation. For now, use Print Report.', 'info');
}

function printReport() {
    window.print();
}

// ====== ATTENDANCE ======
function loadAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const date = document.getElementById('attendanceDate').value;
    
    const container = document.getElementById('attendanceContainer');
    if (!container) return;
    
    if (!classId) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-check"></i>
                <h3>Select a Class</h3>
                <p>Please select a class to view attendance</p>
            </div>
        `;
        return;
    }
    
    const cls = classes.find(c => c.id === classId);
    const classStudents = students.filter(s => s.classId === classId);
    
    // Load existing attendance for this date
    const dateKey = `${date}_${classId}`;
    const existingAttendance = attendance[dateKey] || {};
    
    let html = `
        <div class="attendance-header">
            <h3>Attendance for ${cls?.name || 'Selected Class'} - ${new Date(date).toLocaleDateString()}</h3>
            <div class="attendance-stats">
                <span>Total Students: ${classStudents.length}</span>
                <span id="presentCount">Present: 0</span>
                <span id="absentCount">Absent: 0</span>
                <span id="lateCount">Late: 0</span>
            </div>
        </div>
        <div class="attendance-table">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    classStudents.forEach(student => {
        const studentAttendance = existingAttendance[student.id] || { status: 'present', remarks: '' };
        
        html += `
            <tr>
                <td>
                    <div class="student-cell">
                        <div class="student-avatar xs">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="student-info">
                            <strong>${student.name}</strong>
                            <small>${student.id}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <select class="attendance-status" id="attendance_${student.id}" onchange="updateAttendanceStats()">
                        <option value="present" ${studentAttendance.status === 'present' ? 'selected' : ''}>Present</option>
                        <option value="absent" ${studentAttendance.status === 'absent' ? 'selected' : ''}>Absent</option>
                        <option value="late" ${studentAttendance.status === 'late' ? 'selected' : ''}>Late</option>
                        <option value="excused" ${studentAttendance.status === 'excused' ? 'selected' : ''}>Excused</option>
                    </select>
                </td>
                <td>
                    <input type="text" 
                           class="attendance-remarks" 
                           id="remarks_${student.id}" 
                           placeholder="Optional remarks"
                           value="${studentAttendance.remarks || ''}">
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
    updateAttendanceStats();
}

function updateAttendanceStats() {
    const classId = document.getElementById('attendanceClassSelect').value;
    if (!classId) return;
    
    const classStudents = students.filter(s => s.classId === classId);
    
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    
    classStudents.forEach(student => {
        const select = document.getElementById(`attendance_${student.id}`);
        if (select) {
            switch(select.value) {
                case 'present':
                    presentCount++;
                    break;
                case 'absent':
                    absentCount++;
                    break;
                case 'late':
                    lateCount++;
                    break;
                case 'excused':
                    excusedCount++;
                    break;
            }
        }
    });
    
    const presentCountEl = document.getElementById('presentCount');
    const absentCountEl = document.getElementById('absentCount');
    const lateCountEl = document.getElementById('lateCount');
    
    if (presentCountEl) presentCountEl.textContent = `Present: ${presentCount}`;
    if (absentCountEl) absentCountEl.textContent = `Absent: ${absentCount}`;
    if (lateCountEl) lateCountEl.textContent = `Late: ${lateCount}`;
}

function saveAttendance() {
    const classId = document.getElementById('attendanceClassSelect').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!classId) {
        showNotification('Please select a class first', 'error');
        return;
    }
    
    const classStudents = students.filter(s => s.classId === classId);
    const dateKey = `${date}_${classId}`;
    
    if (!attendance[dateKey]) {
        attendance[dateKey] = {};
    }
    
    let savedCount = 0;
    
    classStudents.forEach(student => {
        const select = document.getElementById(`attendance_${student.id}`);
        const remarks = document.getElementById(`remarks_${student.id}`);
        
        if (select) {
            attendance[dateKey][student.id] = {
                status: select.value,
                remarks: remarks ? remarks.value : '',
                date: date,
                classId: classId,
                studentId: student.id,
                recordedAt: new Date().toISOString()
            };
            savedCount++;
        }
    });
    
    localStorage.setItem('attendance', JSON.stringify(attendance));
    
    showNotification(`Attendance saved for ${savedCount} students`, 'success');
    logActivity(`Saved attendance for class ${classes.find(c => c.id === classId)?.name || classId} on ${date}`, 'success');
}

// ====== ANALYTICS ======
function updateAnalytics() {
    const period = document.getElementById('analyticsPeriod').value;
    
    // Update performance trend chart
    updatePerformanceTrendChart(period);
    
    // Update grade distribution chart
    updateGradeDistributionChart();
    
    // Update class comparison chart
    updateClassComparisonChart();
    
    showNotification(`Analytics updated for ${period} period`, 'info');
}

function updatePerformanceTrendChart(period = 'monthly') {
    const ctx = document.getElementById('performanceTrendChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (performanceTrendChart) {
        performanceTrendChart.destroy();
    }
    
    // Sample data based on period
    let labels = [];
    let data = [];
    
    switch(period) {
        case 'weekly':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [75, 78, 82, 85, 80, 79, 83];
            break;
        case 'monthly':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = [72, 78, 82, 85];
            break;
        case 'quarterly':
            labels = ['Month 1', 'Month 2', 'Month 3'];
            data = [70, 78, 85];
            break;
        case 'yearly':
            labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            data = [68, 75, 82, 87];
            break;
    }
    
    performanceTrendChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Performance',
                data: data,
                borderColor: 'rgba(99, 102, 241, 1)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Performance Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Average Score (%)'
                    }
                }
            }
        }
    });
}

function updateGradeDistributionChart() {
    const ctx = document.getElementById('gradeDistributionChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (gradeDistributionChart) {
        gradeDistributionChart.destroy();
    }
    
    // Calculate grade distribution from actual data
    const gradeCounts = {
        'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
    };
    
    students.forEach(student => {
        const studentMarks = marks[student.id];
        if (studentMarks && studentMarks._meta && studentMarks._meta.grade) {
            const grade = studentMarks._meta.grade;
            if (gradeCounts.hasOwnProperty(grade)) {
                gradeCounts[grade]++;
            }
        }
    });
    
    gradeDistributionChart = new Chart(ctx.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['A+ (90-100%)', 'A (80-89%)', 'B (70-79%)', 'C (60-69%)', 'D (50-59%)', 'F (<50%)'],
            datasets: [{
                data: Object.values(gradeCounts),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Grade Distribution'
                }
            }
        }
    });
}

function updateClassComparisonChart() {
    const ctx = document.getElementById('classComparisonChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (classComparisonChart) {
        classComparisonChart.destroy();
    }
    
    // Calculate class averages
    const classData = [];
    const classLabels = [];
    
    classes.forEach(cls => {
        const classStudents = students.filter(s => s.classId === cls.id);
        let totalAverage = 0;
        let gradedStudents = 0;
        
        classStudents.forEach(student => {
            const studentMarks = marks[student.id];
            if (studentMarks && studentMarks._meta && studentMarks._meta.percentage) {
                totalAverage += studentMarks._meta.percentage;
                gradedStudents++;
            }
        });
        
        if (gradedStudents > 0) {
            classLabels.push(cls.name);
            classData.push(totalAverage / gradedStudents);
        }
    });
    
    classComparisonChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: classLabels,
            datasets: [{
                label: 'Class Average (%)',
                data: classData,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Class Comparison'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Average Score (%)'
                    }
                }
            }
        }
    });
}

// ====== SETTINGS ======
function loadSettings() {
    // Load settings content
    document.getElementById('generalSettings').innerHTML = `
        <div class="settings-form">
            <div class="form-group">
                <label>System Name</label>
                <input type="text" value="EduTrack Pro" class="form-control">
            </div>
            <div class="form-group">
                <label>School Name</label>
                <input type="text" value="Greenwood High School" class="form-control">
            </div>
            <div class="form-group">
                <label>Academic Year</label>
                <input type="text" value="2024-2025" class="form-control">
            </div>
            <div class="form-group">
                <label>Grading System</label>
                <select class="form-control">
                    <option>Percentage System</option>
                    <option>Letter Grade System</option>
                    <option>GPA System</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="saveGeneralSettings()">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `;
    
    document.getElementById('academicSettings').innerHTML = `
        <div class="settings-form">
            <div class="form-group">
                <label>Number of Terms</label>
                <select class="form-control">
                    <option>2 Terms</option>
                    <option>3 Terms</option>
                    <option>4 Terms</option>
                </select>
            </div>
            <div class="form-group">
                <label>Pass Percentage</label>
                <input type="number" value="40" min="0" max="100" class="form-control">
            </div>
            <div class="form-group">
                <label>Attendance Percentage Required</label>
                <input type="number" value="75" min="0" max="100" class="form-control">
            </div>
            <div class="form-group">
                <label>Maximum Marks per Subject</label>
                <input type="number" value="100" min="1" max="200" class="form-control">
            </div>
            <button class="btn btn-primary">
                <i class="fas fa-save"></i> Save Academic Settings
            </button>
        </div>
    `;
    
    document.getElementById('notificationSettings').innerHTML = `
        <div class="settings-form">
            <h4>Email Notifications</h4>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" checked> Send grade updates
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" checked> Send attendance alerts
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox"> Send weekly reports
                </label>
            </div>
            
            <h4>System Notifications</h4>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" checked> Show success notifications
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" checked> Show error notifications
                </label>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" checked> Show warning notifications
                </label>
            </div>
            
            <button class="btn btn-primary">
                <i class="fas fa-save"></i> Save Notification Settings
            </button>
        </div>
    `;
    
    document.getElementById('backupSettings').innerHTML = `
        <div class="settings-form">
            <h4>Backup Options</h4>
            <div class="form-group">
                <p>Last Backup: <span id="lastBackupDate">Never</span></p>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" onclick="backupData()">
                    <i class="fas fa-database"></i> Create Backup Now
                </button>
            </div>
            
            <h4>Restore Options</h4>
            <div class="form-group">
                <label>Upload Backup File</label>
                <input type="file" id="backupFile" accept=".json" class="form-control">
            </div>
            <div class="form-group">
                <button class="btn btn-warning" onclick="restoreBackup()">
                    <i class="fas fa-undo"></i> Restore from Backup
                </button>
            </div>
            
            <h4>Data Management</h4>
            <div class="form-group">
                <button class="btn btn-danger" onclick="clearAllData()">
                    <i class="fas fa-trash"></i> Clear All Data
                </button>
                <small class="text-danger">Warning: This will delete all data permanently!</small>
            </div>
        </div>
    `;
    
    document.getElementById('aboutSettings').innerHTML = `
        <div class="about-content">
            <h3>Education Pro v1.0</h3>
            <p>Complete Academic Management System</p>
            
            <div class="about-details">
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Release Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Developer:</strong> Hakuzimana Alex </p>
                <p><strong>License:</strong> Educational Use</p>
            </div>
            
            <div class="system-stats">
                <h4>System Statistics</h4>
                <p>Classes: ${classes.length}</p>
                <p>Students: ${students.length}</p>
                <p>Subjects: ${subjects.length}</p>
                <p>Activities: ${activities.length}</p>
            </div>
            
            <div class="support-info">
                <h4>Support</h4>
                <p>For support and feedback, please contact:</p>
                <p>Email: sagetalex@outlook.com</p>
                <p>Phone: +250785464622</p>
            </div>
        </div>
    `;
}

function showSettingsTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`.settings-tab-btn[onclick*="'${tabName}'"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Show selected tab
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(`${tabName}Settings`).classList.add('active');
}

function saveGeneralSettings() {
    showNotification('Settings saved successfully!', 'success');
}

function restoreBackup() {
    const fileInput = document.getElementById('backupFile');
    if (!fileInput || !fileInput.files[0]) {
        showNotification('Please select a backup file first', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            // Validate backup data
            if (!backupData.classes || !backupData.students || !backupData.subjects || !backupData.marks) {
                showNotification('Invalid backup file format', 'error');
                return;
            }
            
            if (confirm('This will replace all current data. Are you sure?')) {
                classes = backupData.classes;
                students = backupData.students;
                subjects = backupData.subjects;
                marks = backupData.marks;
                activities = backupData.activities || [];
                notifications = backupData.notifications || [];
                
                saveToLocalStorage();
                
                // Reload the system
                initSystem();
                showNotification('Backup restored successfully!', 'success');
                logActivity('System restored from backup', 'info');
            }
        } catch (error) {
            showNotification('Error reading backup file: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function clearAllData() {
    if (confirm('WARNING: This will delete ALL data permanently! Are you absolutely sure?')) {
        if (confirm('This action cannot be undone. Type "DELETE" to confirm.')) {
            classes = [];
            students = [];
            subjects = [];
            marks = {};
            activities = [];
            notifications = [];
            attendance = {};
            
            localStorage.clear();
            
            // Reload the page
            location.reload();
        }
    }
}

// ====== DASHBOARD FUNCTIONS ======
function updateDashboard() {
    // Update statistics
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalClasses').textContent = classes.length;
    
    const studentsWithMarks = students.filter(s => marks[s.id] && marks[s.id]._meta).length;
    document.getElementById('gradesRecorded').textContent = studentsWithMarks;
    
    // Calculate average score
    let totalAverage = 0;
    let count = 0;
    
    Object.values(marks).forEach(studentMarks => {
        if (studentMarks._meta && studentMarks._meta.percentage) {
            totalAverage += studentMarks._meta.percentage;
            count++;
        }
    });
    
    const averageScore = count > 0 ? Math.round(totalAverage / count) : 0;
    document.getElementById('averageScore').textContent = averageScore + '%';
    
    // Calculate growth percentages (sample data)
    const studentGrowth = students.length > 0 ? Math.round(Math.random() * 10) : 0;
    const scoreGrowth = averageScore > 0 ? Math.round(Math.random() * 5) : 0;
    
    document.getElementById('studentGrowth').textContent = `+${studentGrowth}%`;
    document.getElementById('scoreGrowth').textContent = `+${scoreGrowth}%`;
    
    // Update sidebar counts
    document.getElementById('sidebarStudentCount').textContent = students.length;
    document.getElementById('sidebarClassCount').textContent = classes.length;
    
    // Update user names
    document.getElementById('currentUser').textContent = 'Teacher';
    document.getElementById('mobileUserName').textContent = 'Teacher';
    document.getElementById('sidebarUserName').textContent = 'Teacher';
    
    // Update recent activity
    loadRecentActivity();
    
    // Update recent students
    loadRecentStudents();
    
    // Update top performers
    loadTopPerformers();
    
    // Update performance chart
    updatePerformanceChart();
    
    // Update tab badges
    updateTabBadges();
    
    // Update storage info
    updateStorageInfo();
}

function refreshDashboard() {
    updateDashboard();
    showNotification('Dashboard refreshed', 'success');
}

function loadRecentStudents() {
    const container = document.getElementById('recentStudents');
    if (!container) return;
    
    // Get recent students (last 5)
    const recent = [...students]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-text">No students added yet</p>';
        return;
    }
    
    container.innerHTML = recent.map(student => {
        const studentClass = classes.find(c => c.id === student.classId);
        const hasMarks = marks[student.id] && marks[student.id]._meta;
        
        return `
            <div class="recent-student">
                <div class="student-avatar small">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="student-details">
                    <strong>${student.name}</strong>
                    <small>${studentClass ? studentClass.name : 'N/A'} • ${student.school}</small>
                </div>
                <span class="student-status ${hasMarks ? 'active' : 'pending'}">
                    ${hasMarks ? 'Graded' : 'Pending'}
                </span>
            </div>
        `;
    }).join('');
}

function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    // Get recent activities (last 5)
    const recentActivities = [...activities]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
    
    if (recentActivities.length === 0) {
        container.innerHTML = '<p class="empty-text">No recent activity</p>';
        return;
    }
    
    container.innerHTML = recentActivities.map(activity => {
        const iconClass = activity.type === 'success' ? 'fa-check-circle' :
                         activity.type === 'error' ? 'fa-exclamation-circle' :
                         activity.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.message}</p>
                    <small class="activity-time">${formatTimeAgo(activity.timestamp)}</small>
                </div>
            </div>
        `;
    }).join('');
}

function clearRecentActivity() {
    if (confirm('Clear all recent activity?')) {
        activities = [];
        saveToLocalStorage();
        loadRecentActivity();
        showNotification('Recent activity cleared', 'success');
    }
}

function loadTopPerformers() {
    const container = document.getElementById('topPerformers');
    if (!container) return;
    
    // Get top 5 performers
    const performers = students
        .map(student => {
            const studentMarks = marks[student.id] || {};
            const meta = studentMarks._meta || {};
            return {
                ...student,
                average: meta.percentage || 0,
                grade: meta.grade || 'N/A'
            };
        })
        .filter(s => s.average > 0)
        .sort((a, b) => b.average - a.average)
        .slice(0, 5);
    
    if (performers.length === 0) {
        container.innerHTML = '<p class="empty-text">No marks recorded yet</p>';
        return;
    }
    
    container.innerHTML = performers.map((student, index) => {
        const studentClass = classes.find(c => c.id === student.classId);
        
        return `
            <div class="performer-item">
                <div class="performer-rank">${index + 1}</div>
                <div class="performer-info">
                    <strong>${student.name}</strong>
                    <small>${studentClass ? studentClass.name : 'N/A'}</small>
                </div>
                <div class="performer-score">
                    <span class="average">${student.average.toFixed(1)}%</span>
                    <span class="grade ${getGradeClass(student.grade)}">${student.grade}</span>
                </div>
            </div>
        `;
    }).join('');
}

function updateTopPerformers() {
    // This would filter top performers by selected class
    loadTopPerformers();
}

// ====== DELETE CONFIRMATION ======
function showDeleteConfirmation(type, id) {
    currentDeleteId = id;
    deleteType = type;
    
    let title = '';
    let message = '';
    let details = '';
    
    switch(type) {
        case 'class':
            const cls = classes.find(c => c.id === id);
            if (!cls) return;
            title = `Delete Class "${cls.name}"`;
            message = `Are you sure you want to delete this class?`;
            const classStudents = students.filter(s => s.classId === id);
            const classSubjects = subjects.filter(s => s.classId === id);
            details = `
                <div class="delete-detail-item">
                    <span class="delete-detail-label">Students:</span>
                    <span class="delete-detail-value">${classStudents.length}</span>
                </div>
                <div class="delete-detail-item">
                    <span class="delete-detail-label">Subjects:</span>
                    <span class="delete-detail-value">${classSubjects.length}</span>
                </div>
            `;
            break;
        case 'student':
            const student = students.find(s => s.id === id);
            if (!student) return;
            title = `Delete Student "${student.name}"`;
            message = `Are you sure you want to delete this student?`;
            details = `
                <div class="delete-detail-item">
                    <span class="delete-detail-label">Student ID:</span>
                    <span class="delete-detail-value">${student.id}</span>
                </div>
                <div class="delete-detail-item">
                    <span class="delete-detail-label">Class:</span>
                    <span class="delete-detail-value">${classes.find(c => c.id === student.classId)?.name || 'N/A'}</span>
                </div>
            `;
            break;
        case 'subject':
            const subject = subjects.find(s => s.id === id);
            if (!subject) return;
            title = `Delete Subject "${subject.name}"`;
            message = `Are you sure you want to delete this subject?`;
            details = `
                <div class="delete-detail-item">
                    <span class="delete-detail-label">Class:</span>
                    <span class="delete-detail-value">${classes.find(c => c.id === subject.classId)?.name || 'N/A'}</span>
                </div>
                <div class="delete-detail-item">
                    <span class="delete-detail-label">Max Marks:</span>
                    <span class="delete-detail-value">${subject.maxMarks}</span>
                </div>
            `;
            break;
    }
    
    document.getElementById('deleteTitle').textContent = title;
    document.getElementById('deleteMessage').textContent = message;
    document.getElementById('deleteDetails').innerHTML = details;
    
    openModal('deleteModal');
}

function confirmDelete() {
    if (!currentDeleteId || !deleteType) return;
    
    switch(deleteType) {
        case 'class':
            deleteClass(currentDeleteId);
            break;
        case 'student':
            deleteStudent(currentDeleteId);
            break;
        case 'subject':
            deleteSubject(currentDeleteId);
            break;
    }
    
    closeModal('deleteModal');
    currentDeleteId = null;
    deleteType = null;
}

function deleteClass(classId) {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;
    
    // Remove class
    classes = classes.filter(c => c.id !== classId);
    
    // Remove associated students
    const classStudents = students.filter(s => s.classId === classId);
    students = students.filter(s => s.classId !== classId);
    
    // Remove associated subjects
    const classSubjects = subjects.filter(s => s.classId === classId);
    subjects = subjects.filter(s => s.classId !== classId);
    
    // Remove associated marks
    classStudents.forEach(student => {
        delete marks[student.id];
    });
    
    saveToLocalStorage();
    
    showNotification(`Class "${cls.name}" deleted successfully!`, 'success');
    renderClassesGrid();
    populateAllSelects();
    updateDashboard();
    loadStudentsTable();
    loadSubjectsList();
    logActivity(`Deleted class: ${cls.name} (${classStudents.length} students, ${classSubjects.length} subjects)`, 'warning');
}

function deleteStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    // Remove student
    students = students.filter(s => s.id !== studentId);
    
    // Update class student count
    const studentClass = classes.find(c => c.id === student.classId);
    if (studentClass) {
        studentClass.studentCount = Math.max(0, (studentClass.studentCount || 1) - 1);
        studentClass.updatedAt = new Date().toISOString();
    }
    
    // Remove marks
    delete marks[studentId];
    
    saveToLocalStorage();
    
    showNotification(`Student ${student.name} deleted successfully!`, 'success');
    updateDashboard();
    loadStudentsTable();
    loadRecentStudents();
    updateTabBadges();
    renderClassesGrid();
    loadTopPerformers();
    logActivity(`Deleted student: ${student.name} (${student.id})`, 'warning');
}

function deleteSubject(subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    
    subjects = subjects.filter(s => s.id !== subjectId);
    
    // Remove marks for this subject from all students
    Object.keys(marks).forEach(studentId => {
        if (marks[studentId][subject.name]) {
            delete marks[studentId][subject.name];
            
            // Recalculate meta if subject was removed
            const studentMarks = marks[studentId];
            const subjectsList = Object.keys(studentMarks).filter(k => k !== '_meta');
            
            if (subjectsList.length > 0) {
                let totalObtained = 0;
                let totalPossible = 0;
                
                subjectsList.forEach(subjectName => {
                    const mark = studentMarks[subjectName];
                    const subjectData = subjects.find(s => s.name === subjectName);
                    if (subjectData && mark) {
                        totalObtained += mark;
                        totalPossible += subjectData.maxMarks;
                    }
                });
                
                if (totalPossible > 0) {
                    const percentage = (totalObtained / totalPossible) * 100;
                    const grade = getGradeFromPercentage(percentage);
                    
                    marks[studentId]._meta = {
                        totalObtained: totalObtained,
                        totalPossible: totalPossible,
                        percentage: percentage,
                        grade: grade,
                        lastUpdated: new Date().toISOString()
                    };
                }
            } else {
                delete marks[studentId]._meta;
            }
        }
    });
    
    saveToLocalStorage();
    
    showNotification(`Subject "${subject.name}" deleted successfully!`, 'success');
    loadSubjectsList();
    updateDashboard();
    loadStudentsTable();
    loadTopPerformers();
    logActivity(`Deleted subject: ${subject.name}`, 'warning');
}

// ====== HELPER FUNCTIONS ======
function getGradeFromPercentage(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage > 0) return 'F';
    return 'N/A';
}

function getGradeClass(grade) {
    if (grade.includes('A+')) return 'grade-a-plus';
    if (grade.includes('A')) return 'grade-a';
    if (grade.includes('B')) return 'grade-b';
    if (grade.includes('C')) return 'grade-c';
    if (grade.includes('D')) return 'grade-d';
    if (grade.includes('F')) return 'grade-f';
    return '';
}

function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    if (score > 0) return 'score-low';
    return '';
}

function getSubjectRemarks(percentage) {
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Average';
    if (percentage >= 50) return 'Needs Improvement';
    if (percentage > 0) return 'Poor';
    return 'No Data';
}

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(timestamp);
}

function populateAllSelects() {
    // Populate all class select elements
    const classSelects = [
        'studentClass',
        'marksClassSelect',
        'reportClassSelect',
        'attendanceClassSelect',
        'subjectClass',
        'filterClass'
    ];
    
    classSelects.forEach(selectId => {
        populateClassSelect(selectId);
    });
}

function populateClassSelect(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Save current value
    const currentValue = select.value;
    
    // Clear options
    select.innerHTML = '';
    
    // Add default option based on select
    if (selectId === 'reportClassSelect' || selectId === 'filterClass') {
        select.innerHTML = '<option value="">All Classes</option>';
    } else {
        select.innerHTML = '<option value="">Select Class</option>';
    }
    
    // Add class options
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = `${cls.name} (Grade ${cls.grade})`;
        select.appendChild(option);
    });
    
    // Restore previous value if it exists
    if (classes.some(c => c.id === currentValue)) {
        select.value = currentValue;
    }
}

// ====== CHART FUNCTIONS ======
function initializeCharts() {
    // Initialize performance chart if canvas exists
    const ctx = document.getElementById('performanceChart');
    if (ctx && typeof Chart !== 'undefined') {
        performanceChart = new Chart(ctx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Grade A (90-100%)', 'Grade B (80-89%)', 'Grade C (70-79%)', 'Below 70%'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    // Initialize subject distribution chart
    const subjectCtx = document.getElementById('subjectDistributionChart');
    if (subjectCtx && typeof Chart !== 'undefined') {
        subjectDistributionChart = new Chart(subjectCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Average Score',
                    data: [],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Update charts with initial data
    updatePerformanceChart();
    updateSubjectDistributionChart();
}

function updatePerformanceChart() {
    if (!performanceChart) return;
    
    // Calculate grade distribution from actual data
    const gradesData = {
        'A': 0, 'B': 0, 'C': 0, 'below': 0
    };
    
    Object.values(marks).forEach(studentMarks => {
        const meta = studentMarks._meta;
        if (meta && meta.percentage) {
            const average = meta.percentage;
            if (average >= 90) gradesData['A']++;
            else if (average >= 80) gradesData['A']++;
            else if (average >= 70) gradesData['B']++;
            else if (average >= 60) gradesData['C']++;
            else if (average > 0) gradesData['below']++;
        }
    });
    
    performanceChart.data.datasets[0].data = [
        gradesData['A'],
        gradesData['B'],
        gradesData['C'],
        gradesData['below']
    ];
    
    performanceChart.update();
}

function updateSubjectDistributionChart() {
    if (!subjectDistributionChart) return;
    
    // Calculate average scores per subject
    const subjectAverages = {};
    const subjectCounts = {};
    
    subjects.forEach(subject => {
        const classStudents = students.filter(s => s.classId === subject.classId);
        let totalMarks = 0;
        let count = 0;
        
        classStudents.forEach(student => {
            const studentMarks = marks[student.id];
            if (studentMarks && studentMarks[subject.name] && studentMarks[subject.name].average) {
                totalMarks += studentMarks[subject.name].average;
                count++;
            }
        });
        
        if (count > 0) {
            subjectAverages[subject.name] = (totalMarks / count / subject.maxMarks) * 100;
            subjectCounts[subject.name] = count;
        }
    });
    
    const sortedSubjects = Object.keys(subjectAverages).sort((a, b) => subjectAverages[b] - subjectAverages[a]);
    
    subjectDistributionChart.data.labels = sortedSubjects.slice(0, 5);
    subjectDistributionChart.data.datasets[0].data = sortedSubjects.slice(0, 5).map(subject => subjectAverages[subject]);
    
    subjectDistributionChart.update();
}

function updateClassPerformanceChart() {
    // This would update the chart on reports page
    updatePerformanceChart();
}

// ====== UTILITY FUNCTIONS ======
function saveToLocalStorage() {
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('marks', JSON.stringify(marks));
    localStorage.setItem('attendance', JSON.stringify(attendance));
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function closeUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.remove('show');
}

function viewProfile() {
    showNotification('Profile view feature coming soon!', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully', 'success');
        // In a real application, this would redirect to login page
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

function updateTabBadges() {
    // Update sidebar badges
    const studentsBadge = document.getElementById('studentsBadge');
    const classesBadge = document.getElementById('classesBadge');
    const subjectsBadge = document.getElementById('subjectsBadge');
    const marksBadge = document.getElementById('marksBadge');
    const attendanceBadge = document.getElementById('attendanceBadge');
    
    if (studentsBadge) {
        studentsBadge.textContent = students.length;
        studentsBadge.style.display = students.length > 0 ? 'flex' : 'none';
    }
    
    if (classesBadge) {
        classesBadge.textContent = classes.length;
        classesBadge.style.display = classes.length > 0 ? 'flex' : 'none';
    }
    
    if (subjectsBadge) {
        subjectsBadge.textContent = subjects.length;
        subjectsBadge.style.display = subjects.length > 0 ? 'flex' : 'none';
    }
    
    if (marksBadge) {
        const studentsWithMarks = students.filter(s => marks[s.id] && marks[s.id]._meta).length;
        marksBadge.textContent = studentsWithMarks;
        marksBadge.style.display = studentsWithMarks > 0 ? 'flex' : 'none';
    }
    
    if (attendanceBadge) {
        attendanceBadge.textContent = Object.keys(attendance).length;
        attendanceBadge.style.display = Object.keys(attendance).length > 0 ? 'flex' : 'none';
    }
    
    // Update mobile sidebar badges
    const mobileStudentsBadge = document.getElementById('mobileStudentsBadge');
    const mobileClassesBadge = document.getElementById('mobileClassesBadge');
    const mobileSubjectsBadge = document.getElementById('mobileSubjectsBadge');
    const mobileMarksBadge = document.getElementById('mobileMarksBadge');
    
    if (mobileStudentsBadge) {
        mobileStudentsBadge.textContent = students.length;
        mobileStudentsBadge.style.display = students.length > 0 ? 'flex' : 'none';
    }
    
    if (mobileClassesBadge) {
        mobileClassesBadge.textContent = classes.length;
        mobileClassesBadge.style.display = classes.length > 0 ? 'flex' : 'none';
    }
    
    if (mobileSubjectsBadge) {
        mobileSubjectsBadge.textContent = subjects.length;
        mobileSubjectsBadge.style.display = subjects.length > 0 ? 'flex' : 'none';
    }
    
    if (mobileMarksBadge) {
        const studentsWithMarks = students.filter(s => marks[s.id] && marks[s.id]._meta).length;
        mobileMarksBadge.textContent = studentsWithMarks;
        mobileMarksBadge.style.display = studentsWithMarks > 0 ? 'flex' : 'none';
    }
}

// ====== QUICK ACTIONS ======
function showQuickActionModal() {
    openModal('quickActionsModal');
}

function showBulkUploadModal() {
    showNotification('Bulk upload feature coming soon!', 'info');
}

function showBulkMarksModal() {
    const classId = document.getElementById('marksClassSelect')?.value;
    const subjectId = document.getElementById('marksSubjectSelect')?.value;
    
    if (!classId || !subjectId) {
        showNotification('Please select a class and subject first', 'error');
        return;
    }
    
    showNotification('Bulk marks entry feature coming soon!', 'info');
}

function generateQuickReport() {
    const studentWithMarks = students.find(s => marks[s.id] && marks[s.id]._meta);
    if (studentWithMarks) {
        generateStudentReport(studentWithMarks.id);
    } else {
        showNotification('No students with marks to generate report', 'warning');
    }
}

function exportAllData() {
    const exportData = {
        classes: classes,
        students: students,
        subjects: subjects,
        marks: marks,
        attendance: attendance,
        activities: activities,
        notifications: notifications,
        exportDate: new Date().toISOString(),
        version: '5.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `edutrack_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('All data exported successfully!', 'success');
    logActivity('Exported all system data', 'info');
}

function backupData() {
    const backup = {
        classes: classes,
        students: students,
        subjects: subjects,
        marks: marks,
        attendance: attendance,
        activities: activities,
        notifications: notifications,
        timestamp: new Date().toISOString(),
        version: '5.0'
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `edutrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Backup created successfully!', 'success');
    logActivity('Created system backup', 'info');
}

function printDashboard() {
    window.print();
}

// ====== GLOBAL SEARCH ======
function globalSearchHandler() {
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase();
    if (!searchTerm.trim()) return;
    
    // Search across all data
    const results = [];
    
    // Search classes
    classes.forEach(cls => {
        if (cls.name.toLowerCase().includes(searchTerm) || 
            cls.teacher.toLowerCase().includes(searchTerm) ||
            cls.grade.includes(searchTerm)) {
            results.push({
                type: 'Class',
                name: cls.name,
                detail: `Grade ${cls.grade} • ${cls.teacher}`,
                action: () => {
                    switchTab('classes-tab');
                    document.getElementById('searchClasses').value = cls.name;
                    renderClassesGrid();
                }
            });
        }
    });
    
    // Search students
    students.forEach(student => {
        if (student.name.toLowerCase().includes(searchTerm) || 
            student.school.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.parent.toLowerCase().includes(searchTerm)) {
            results.push({
                type: 'Student',
                name: student.name,
                detail: student.school,
                action: () => {
                    switchTab('students-tab');
                    document.getElementById('searchStudents').value = student.name;
                    loadStudentsTable();
                }
            });
        }
    });
    
    // Search subjects
    subjects.forEach(subject => {
        if (subject.name.toLowerCase().includes(searchTerm)) {
            const cls = classes.find(c => c.id === subject.classId);
            results.push({
                type: 'Subject',
                name: subject.name,
                detail: cls ? cls.name : 'Unknown Class',
                action: () => {
                    switchTab('subjects-tab');
                    document.getElementById('searchSubjects').value = subject.name;
                    loadSubjectsList();
                }
            });
        }
    });
    
    // Display results in a dropdown
    showSearchResults(results, searchTerm);
}

function showSearchResults(results, searchTerm) {
    // Remove existing search results
    const existingResults = document.getElementById('searchResultsDropdown');
    if (existingResults) {
        existingResults.remove();
    }
    
    if (results.length === 0) {
        showNotification(`No results found for "${searchTerm}"`, 'info');
        return;
    }
    
    const dropdown = document.createElement('div');
    dropdown.id = 'searchResultsDropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        width: 500px;
        max-width: 90vw;
        background: var(--bg-card);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: 2000;
        max-height: 400px;
        overflow-y: auto;
        border: 1px solid var(--gray-200);
    `;
    
    let html = `
        <div class="search-results-header">
            <h4>Search Results (${results.length})</h4>
            <button onclick="document.getElementById('searchResultsDropdown').remove()">&times;</button>
        </div>
        <div class="search-results-list">
    `;
    
    results.forEach(result => {
        html += `
            <div class="search-result-item" onclick="${result.action.toString().replace(/\n/g, ' ')}; document.getElementById('searchResultsDropdown').remove()">
                <div class="search-result-type ${result.type.toLowerCase()}">${result.type}</div>
                <div class="search-result-content">
                    <strong>${result.name}</strong>
                    <small>${result.detail}</small>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
    });
    
    html += `</div>`;
    dropdown.innerHTML = html;
    
    document.querySelector('.nav-search').appendChild(dropdown);
}

function clearGlobalSearch() {
    document.getElementById('globalSearch').value = '';
    const existingResults = document.getElementById('searchResultsDropdown');
    if (existingResults) {
        existingResults.remove();
    }
}

function clearClassSearch() {
    const searchInput = document.getElementById('searchClasses');
    if (searchInput) {
        searchInput.value = '';
        renderClassesGrid();
    }
}

function clearSubjectSearch() {
    const searchInput = document.getElementById('searchSubjects');
    if (searchInput) {
        searchInput.value = '';
        loadSubjectsList();
    }
}

// ====== COLOR PICKER FUNCTIONS ======
function setColor(color) {
    document.getElementById('classColor').value = color;
}

function setSubjectColor(color) {
    document.getElementById('subjectColor').value = color;
}

// ====== STORAGE MANAGEMENT ======
function updateStorageInfo() {
    const dataSize = JSON.stringify({
        classes, students, subjects, marks, attendance, activities, notifications
    }).length;
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    const usagePercentage = (dataSize / maxSize) * 100;
    
    const storageFill = document.getElementById('storageFill');
    const storageText = document.getElementById('storageText');
    
    if (storageFill) {
        storageFill.style.width = `${Math.min(usagePercentage, 100)}%`;
    }
    
    if (storageText) {
        const usedMB = (dataSize / 1024 / 1024).toFixed(2);
        storageText.textContent = `Storage: ${usedMB} MB (${Math.round(usagePercentage)}%)`;
    }
}

// ====== LOADING OVERLAY ======
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// ====== GLOBAL EXPORTS ======
// Make functions available globally
window.switchTab = switchTab;
window.showCreateClassModal = showCreateClassModal;
window.showAddStudentModal = showAddStudentModal;
window.showCreateSubjectModal = showCreateSubjectModal;
window.showDeleteConfirmation = showDeleteConfirmation;
window.showQuickActionModal = showQuickActionModal;
window.showBulkUploadModal = showBulkUploadModal;
window.showBulkMarksModal = showBulkMarksModal;
window.generateQuickReport = generateQuickReport;
window.exportAllData = exportAllData;
window.backupData = backupData;
window.printDashboard = printDashboard;
window.refreshDashboard = refreshDashboard;
window.clearRecentActivity = clearRecentActivity;
window.updateTopPerformers = updateTopPerformers;
window.updatePerformanceChart = updatePerformanceChart;
window.clearGlobalSearch = clearGlobalSearch;
window.clearClassSearch = clearClassSearch;
window.clearStudentSearch = clearStudentSearch;
window.clearSubjectSearch = clearSubjectSearch;
window.toggleTheme = toggleTheme;
window.toggleNotifications = toggleNotifications;
window.clearNotifications = clearNotifications;
window.viewProfile = viewProfile;
window.logout = logout;
window.openMobileSidebar = openMobileSidebar;
window.closeMobileSidebar = closeMobileSidebar;
window.prevPage = prevPage;
window.nextPage = nextPage;
window.filterStudents = filterStudents;
window.filterReports = filterReports;
window.showReportType = showReportType;
window.generateAllReports = generateAllReports;
window.generateStudentReport = generateStudentReport;
window.loadClassStudents = loadClassStudents;
window.loadSubjectMarks = loadSubjectMarks;
window.calculateClassAverage = calculateClassAverage;
window.saveAllMarks = saveAllMarks;
window.updateMarksSummary = updateMarksSummary;
window.loadAttendance = loadAttendance;
window.saveAttendance = saveAttendance;
window.updateAnalytics = updateAnalytics;
window.showSettingsTab = showSettingsTab;
window.editClass = editClass;
window.editStudent = editStudent;
window.editSubject = editSubject;
window.viewClassDetails = viewClassDetails;
window.enterStudentMarks = enterStudentMarks;
window.setColor = setColor;
window.setSubjectColor = setSubjectColor;
window.updateStudentMark = updateStudentMark;