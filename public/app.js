// =====================================
// JavaScript AI Tutor - Chat Interface
// =====================================

// DOM Elements
const chatForm = document.querySelector('.chat-form');
const messageInput = document.getElementById('message-input');
const chatArea = document.querySelector('.chat-area');
const sendButton = document.getElementById('send-button');

// Create a message element
function createMessage(role, content) {
    const messageContainer = document.createElement('div');

    messageContainer.className = `message ${role}-message`;

    const messageBubble = document.createElement('div');

    messageBubble.className = 'message-bubble';

    // Preserve text safely without interpreting it as HTML
    messageBubble.textContent = content;

    messageContainer.appendChild(messageBubble);

    return messageContainer;
}


// Display a message
function displayMessage(role, content) {
    const welcomeMessage = document.querySelector('.welcome-message');

    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    const messageElement = createMessage(role, content);

    chatArea.appendChild(messageElement);

    chatArea.scrollTop = chatArea.scrollHeight;
}


// Show loading indicator
function showLoading() {
    const loading = document.createElement('div');

    loading.id = 'loading-indicator';
    loading.className = 'message assistant-message';

    loading.innerHTML = `
        <div class="message-bubble loading">
            يفكر المدرّس الآن...
        </div>
    `;

    chatArea.appendChild(loading);

    chatArea.scrollTop = chatArea.scrollHeight;
}


// Remove loading indicator
function removeLoading() {
    const loading = document.getElementById('loading-indicator');

    if (loading) {
        loading.remove();
    }
}


// Send message to Backend
async function sendMessage(message) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'حدث خطأ أثناء إرسال الرسالة.');
        }

        return data.reply;

    } catch (error) {
        throw error;
    }
}


// Handle Form Submission
chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();

    if (!message) {
        return;
    }

    // Display student message
    displayMessage('user', message);

    // Clear input
    messageInput.value = '';

    // Disable button while waiting
    sendButton.disabled = true;

    showLoading();

    try {
        const reply = await sendMessage(message);

        removeLoading();

        displayMessage('assistant', reply);

    } catch (error) {
        removeLoading();

        displayMessage(
            'assistant',
            `حدث خطأ: ${error.message}`
        );

    } finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
});


// Auto-resize textarea
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';

    messageInput.style.height =
        `${messageInput.scrollHeight}px`;
});

// =====================================
// Navigation System
// =====================================

const navigationButtons = document.querySelectorAll('.sidebar-item');
const chatInputContainer = document.querySelector('.chat-input-container');
const headerTitle = document.querySelector('.chat-header h1');
const headerSubtitle = document.querySelector('.chat-header p');

// Create page container
const pageView = document.createElement('div');
pageView.className = 'page-view';
pageView.style.display = 'none';

chatArea.appendChild(pageView);

// Page content
const pages = {

    curriculum: {
        title: 'المنهج الدراسي',
        subtitle: 'خارطة طريق تعلم JavaScript',

        content: `
            <h2>منهج JavaScript</h2>
            <p class="page-description">
                مسار تعليمي يبدأ من الصفر وينتهي بالاستعداد لتطوير التطبيقات باستخدام React Native.
            </p>

            <div class="unit-list">

                <div class="unit-card">
                    <span>Unit 0</span>
                    <h3>Development Environment & First Program</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 1</span>
                    <h3>Syntax, Variables & Data Types</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 2</span>
                    <h3>Operators & Expressions</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 3</span>
                    <h3>Loops & Iteration</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 4</span>
                    <h3>Functions & Scope</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 5</span>
                    <h3>Arrays & Array Methods</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 6</span>
                    <h3>Objects & Object Manipulation</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 7</span>
                    <h3>Modern JavaScript & Immutability</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 8</span>
                    <h3>Advanced Functions, Callbacks & Closures</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 9</span>
                    <h3>Modules, JSON & npm</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 10</span>
                    <h3>Classes, Prototypes & Built-in Objects</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 11</span>
                    <h3>Debugging, Error Handling & Code Quality</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 12</span>
                    <h3>Asynchronous JavaScript & APIs</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 13</span>
                    <h3>Integrated JavaScript Project</h3>
                </div>

                <div class="unit-card">
                    <span>Unit 14</span>
                    <h3>Final Review & React Readiness</h3>
                </div>

            </div>
        `
    },

    progress: {
        title: 'تقدمي الدراسي',
        subtitle: 'متابعة رحلتك التعليمية',

        content: `
    <h2>التقدم الدراسي</h2>

    <p class="page-description">
        هنا ستتمكن من متابعة الدروس التي أكملتها ومستوى تقدمك في المنهج.
    </p>

    <div class="progress-card">
        <h3>الدروس المكتملة</h3>
        <p id="completed-lessons">جارٍ تحميل البيانات...</p>
    </div>

    <div class="progress-card">
        <h3>الوحدة الحالية</h3>
        <p id="current-unit">جارٍ تحميل البيانات...</p>
    </div>

    <div class="progress-card">
        <h3>الدرس الحالي</h3>
        <p id="current-lesson">جارٍ تحميل البيانات...</p>
    </div>
`
    },
    profile: {
    title: 'ملفي الشخصي',
    subtitle: 'معلوماتك وأهدافك التعليمية',

    content: `
        <h2>الملف الشخصي</h2>

        <p class="page-description">
            معلوماتك وأهدافك التعليمية ونقاط قوتك والجوانب التي تحتاج إلى تطويرها.
        </p>

        <div class="progress-card">
            <h3>أهدافي التعليمية</h3>
            <ul id="profile-goals">
                <li>جارٍ تحميل البيانات...</li>
            </ul>
        </div>

        <div class="progress-card">
            <h3>نقاط قوتي</h3>
            <ul id="profile-strengths">
                <li>جارٍ تحميل البيانات...</li>
            </ul>
        </div>

        <div class="progress-card">
            <h3>الجوانب التي أحتاج إلى تطويرها</h3>
            <ul id="profile-weaknesses">
                <li>جارٍ تحميل البيانات...</li>
            </ul>
        </div>
    `
}

};

// Load progress data from Backend
async function loadProgress() {
    try {
        const response = await fetch('/api/progress');

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load progress.');
        }

        const completedLessons = document.getElementById('completed-lessons');
        const currentUnit = document.getElementById('current-unit');
        const currentLesson = document.getElementById('current-lesson');

        completedLessons.textContent = data.completedLessons.length;

        currentUnit.textContent = `Unit ${data.currentUnit}`;

        currentLesson.textContent = `Lesson ${data.currentLesson}`;

    } catch (error) {
        console.error('Failed to load progress:', error);
    }
}

// Load student profile from Backend
async function loadProfile() {
    try {
        const response = await fetch('/api/profile');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load student profile.');
        }

        const goals = document.getElementById('profile-goals');
        const strengths = document.getElementById('profile-strengths');
        const weaknesses = document.getElementById('profile-weaknesses');

        goals.innerHTML = '';
        strengths.innerHTML = '';
        weaknesses.innerHTML = '';

        data.learningGoals.forEach(goal => {
            const item = document.createElement('li');
            item.textContent = goal;
            goals.appendChild(item);
        });

        data.strengths.forEach(strength => {
            const item = document.createElement('li');
            item.textContent = strength;
            strengths.appendChild(item);
        });

        data.weaknesses.forEach(weakness => {
            const item = document.createElement('li');
            item.textContent = weakness;
            weaknesses.appendChild(item);
        });

    } catch (error) {
        console.error('Failed to load profile:', error);
    }
}

// Navigate between pages
function navigateTo(pageName) {

    // Reset active navigation button
    navigationButtons.forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(
        `[data-page="${pageName}"]`
    );

    if (activeButton) {
        activeButton.classList.add('active');
    }

    if (pageName === 'chat') {

        pageView.style.display = 'none';

        Array.from(chatArea.children).forEach(element => {
            if (element !== pageView) {
                element.style.display = '';
            }
        });

        chatInputContainer.style.display = '';

        headerTitle.textContent = 'المحادثة التعليمية';
        headerSubtitle.textContent = 'تعلم JavaScript خطوة بخطوة';

        return;
    }

    const page = pages[pageName];

    if (!page) return;

    // Hide chat messages
    Array.from(chatArea.children).forEach(element => {
        if (element !== pageView) {
            element.style.display = 'none';
        }
    });

    // Display selected page
    pageView.innerHTML = page.content;
    pageView.style.display = 'block';
    if (pageName === 'progress') {
    loadProgress();
}
if (pageName === 'profile') {
    loadProfile();
}

    // Hide chat input outside chat page
    chatInputContainer.style.display = 'none';

    // Update header
    headerTitle.textContent = page.title;
    headerSubtitle.textContent = page.subtitle;

}


// Attach click events
navigationButtons.forEach(button => {

    button.addEventListener('click', () => {

        const pageName = button.dataset.page;

        navigateTo(pageName);

    });

});