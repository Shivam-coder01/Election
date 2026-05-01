/**
 * Election Guide AI Assistant - Core Logic
 */

class ElectionApp {
    constructor() {
        this.currentView = 'home';
        this.userState = {
            country: 'India',
            interestLevel: 'beginner', // beginner, advanced
            topicsCovered: [],
            badges: ['Beginner']
        };
        
        // Quiz Data
        this.quizzes = [
            {
                question: "What is the minimum voting age in India?",
                options: ["16 Years", "18 Years", "21 Years", "25 Years"],
                answer: 1, // index of "18 Years"
                explanation: "The minimum voting age in India was reduced from 21 to 18 years by the 61st Constitutional Amendment Act of 1988."
            },
            {
                question: "Which ID is NOT accepted at a polling booth?",
                options: ["Voter ID Card", "Passport", "Driving License", "Gym Membership Card"],
                answer: 3,
                explanation: "You must present an official photo ID issued by the government, such as a Voter ID (EPIC), Passport, Driving License, or Aadhaar Card."
            },
            {
                question: "What machine is used to cast votes electronically?",
                options: ["ATM", "EVM", "VVPAT", "POS"],
                answer: 1,
                explanation: "EVM stands for Electronic Voting Machine. It allows voters to cast their vote electronically, which is faster and saves paper."
            },
            {
                question: "What does NOTA stand for?",
                options: ["None Of The Above", "No Other True Alternative", "Not On The Agenda", "National Organization of Trade Associations"],
                answer: 0,
                explanation: "NOTA (None Of The Above) is an option on the EVM that allows a voter to reject all candidates in their constituency."
            },
            {
                question: "Who is responsible for conducting elections in India?",
                options: ["The Supreme Court", "The Parliament", "The Election Commission of India (ECI)", "The President"],
                answer: 2,
                explanation: "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India at national and state levels."
            }
        ];
        
        this.quizState = {
            active: false,
            currentQuestion: 0,
            score: 0
        };

        // Cache DOM elements
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.views = document.querySelectorAll('.view-section');
        this.chatInput = document.getElementById('chat-input');
        this.chatForm = document.getElementById('chat-form');
        this.chatMessages = document.getElementById('chat-messages');

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupChat();
        this.setupTimeline();
        this.setupFAQs();
        this.updateOverallProgress();
    }

    // --- Navigation Logic ---
    setupNavigation() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if(view) this.switchView(view);
            });
        });
    }

    switchView(viewId) {
        // Update nav UI
        this.navButtons.forEach(btn => {
            if (btn.dataset.view === viewId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Switch sections
        this.views.forEach(view => {
            if (view.id === `view-${viewId}`) {
                view.classList.add('active');
                
                // Trigger animations again
                const animatedElements = view.querySelectorAll('.slide-up, .pop-in');
                animatedElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; /* trigger reflow */
                    el.style.animation = null; 
                });
            } else {
                view.classList.remove('active');
            }
        });

        this.currentView = viewId;

        // Auto-scroll chat to bottom if switching to chat
        if(viewId === 'chat') {
            this.scrollToBottom();
            setTimeout(() => this.chatInput.focus(), 300);
        }
    }

    // --- Chat Engine (Mock AI) ---
    setupChat() {
        this.chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = this.chatInput.value.trim();
            if (message) {
                this.addUserMessage(message);
                this.chatInput.value = '';
                this.processUserMessage(message);
            }
        });

        // Setup quick reply chips delegation
        this.chatMessages.addEventListener('click', (e) => {
            if (e.target.classList.contains('chip')) {
                const text = e.target.textContent.replace(/[^\w\s\?]/g, '').trim(); // Remove emojis
                this.addUserMessage(text);
                this.processUserMessage(text);
                // Remove the chips after selection
                e.target.parentElement.remove();
            }
        });
    }

    addUserMessage(text) {
        const msgHTML = `
            <div class="message user-message pop-in">
                <div class="message-content">
                    <p>${this.escapeHTML(text)}</p>
                </div>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', msgHTML);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgHTML = `
            <div class="message ai-message pop-in" id="${id}">
                <div class="message-content typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', msgHTML);
        this.scrollToBottom();
        return id;
    }

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if(el) el.remove();
    }

    addAIMessage(text, chips = []) {
        let chipsHTML = '';
        if (chips.length > 0) {
            chipsHTML = `<div class="quick-chips">`;
            chips.forEach(chip => {
                chipsHTML += `<button class="chip">${chip}</button>`;
            });
            chipsHTML += `</div>`;
        }

        const msgHTML = `
            <div class="message ai-message pop-in">
                <div class="message-content">
                    ${text}
                    ${chipsHTML}
                </div>
            </div>
        `;
        this.chatMessages.insertAdjacentHTML('beforeend', msgHTML);
        this.scrollToBottom();
    }

    processUserMessage(message) {
        const typingId = this.showTypingIndicator();
        
        // Simulate network delay for realism
        setTimeout(() => {
            this.removeTypingIndicator(typingId);
            const lowerMsg = message.toLowerCase();
            
            // Context Awareness & Smart Logic
            if (!this.userState.topicsCovered.includes('registration') && (lowerMsg.includes('register') || lowerMsg.includes('how to register'))) {
                this.userState.topicsCovered.push('registration');
                this.updateOverallProgress();
                this.addAIMessage(
                    `<p>To register to vote in <strong>${this.userState.country}</strong>, you need to fill out <strong>Form 6</strong>.</p>
                     <p>Here are the basics:</p>
                     <ul>
                        <li>Must be 18+ years old</li>
                        <li>Need Address & ID Proof (like Aadhaar or Passport)</li>
                     </ul>
                     <p>You can do this entirely online via the Voter Portal. Should we look at the exact documents needed, or explore the Timeline?</p>`,
                    ['📄 Exact Documents', '📅 Explore Timeline']
                );
            } 
            else if (lowerMsg.includes('exact documents')) {
                this.addAIMessage(
                    `<p>You will need:</p>
                     <ul>
                        <li><strong>Passport size photo</strong></li>
                        <li><strong>Age proof</strong> (Birth certificate, 10th mark sheet, PAN Card)</li>
                        <li><strong>Address proof</strong> (Aadhaar, Passport, Utility bill)</li>
                     </ul>
                     <p>Would you like to take a quick quiz to earn your 'Registered' badge?</p>`,
                    ['🎯 Take Quiz', '🗳️ Ask about Voting']
                );
            }
            else if (lowerMsg.includes('vote') || lowerMsg.includes('voting process')) {
                this.userState.topicsCovered.push('voting');
                this.updateOverallProgress();
                this.addAIMessage(
                    `<p>On Election Day, the process is very straightforward:</p>
                     <ol>
                        <li>Check your name on the voter slip at the booth entrance.</li>
                        <li>Show your ID to the polling officer.</li>
                        <li>Go to the voting compartment and press the button on the <strong>EVM</strong> next to your chosen candidate.</li>
                        <li>Wait for the beep sound and verify your vote on the VVPAT machine.</li>
                     </ol>
                     <p>Do you know what an EVM or VVPAT is?</p>`,
                    ['🤔 What is an EVM?', '🖨️ What is VVPAT?']
                );
            }
            else if (lowerMsg.includes('evm')) {
                this.addAIMessage(
                    `<p><strong>EVM</strong> stands for Electronic Voting Machine.</p>
                     <p>It's a secure, standalone machine used to record votes electronically, making the process faster and saving paper. It's not connected to any network.</p>`,
                    ['🎯 Test my knowledge!', '🖨️ What is VVPAT?']
                );
            }
            else if (lowerMsg.includes('vvpat')) {
                this.addAIMessage(
                    `<p><strong>VVPAT</strong> stands for Voter Verifiable Paper Audit Trail.</p>
                     <p>It's a printer attached to the EVM. When you vote, it prints a slip showing the serial number, name, and symbol of the candidate you voted for. It's visible for 7 seconds through a glass window so you can verify your vote.</p>`,
                    ['🗳️ Voting process']
                );
            }
            else if (lowerMsg.includes('nota')) {
                this.addAIMessage(
                    `<p><strong>NOTA</strong> stands for 'None Of The Above'.</p>
                     <p>It's an option on the EVM that allows a voter to officially register a vote of rejection for all candidates contesting in their constituency.</p>`,
                    ['🎯 Test my knowledge!']
                );
            }
            else if (lowerMsg.includes('eci') || lowerMsg.includes('election commission')) {
                this.addAIMessage(
                    `<p>The <strong>Election Commission of India (ECI)</strong> is an autonomous constitutional authority responsible for administering election processes in India.</p>
                     <p>They ensure elections are free and fair, prepare electoral rolls, and enforce the Model Code of Conduct.</p>`,
                    ['📜 What is Model Code of Conduct?']
                );
            }
            else if (lowerMsg.includes('model code of conduct') || lowerMsg.includes('mcc') || lowerMsg.includes('campaign rules')) {
                this.addAIMessage(
                    `<p>The <strong>Model Code of Conduct (MCC)</strong> is a set of guidelines issued by the ECI for candidates and political parties.</p>
                     <p>It regulates speeches, polling day, polling booths, portfolios, election manifestos, processions, and general conduct to ensure a level playing field.</p>`,
                    ['📅 Explore Timeline']
                );
            }
            else if (lowerMsg.includes('quiz') || lowerMsg.includes('take quiz') || lowerMsg.includes('test my knowledge')) {
                 this.addAIMessage(
                    `<p>Awesome! Let's jump over to the Quiz section. Good luck! 🏆</p>`
                );
                setTimeout(() => this.switchView('quiz'), 1500);
            }
            else if (lowerMsg.includes('timeline')) {
                 this.addAIMessage(
                    `<p>The Indian election timeline involves 6 main phases, from Registration to Results. Let's head over to the interactive timeline to explore them all!</p>`
                );
                setTimeout(() => this.switchView('timeline'), 1500);
            }
            else {
                // Generic fallback, guiding the user
                this.addAIMessage(
                    `<p>That's an interesting point! As your Election Guide, I can help you understand the Indian electoral process.</p>
                     <p>What would you like to explore?</p>`,
                    ['📝 Registration', '📜 Model Code of Conduct', '🗳️ Voting Day', '❓ Common Myths']
                );
                if (lowerMsg.includes('myth') || lowerMsg.includes('faq')) {
                     setTimeout(() => this.switchView('faq'), 1500);
                }
            }
        }, 1200 + Math.random() * 800); // Random delay between 1.2s and 2s
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    chatAbout(topic) {
        this.switchView('chat');
        this.addUserMessage(topic);
        this.processUserMessage(topic);
    }

    // --- Timeline Interaction ---
    setupTimeline() {
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                // Remove active from all
                nodes.forEach(n => n.classList.remove('active'));
                document.querySelectorAll('.timeline-connector').forEach(c => c.classList.remove('active'));
                
                // Add active up to current
                for(let i=0; i<=index; i++) {
                    nodes[i].classList.add('active');
                    if(i < index) {
                        document.querySelectorAll('.timeline-connector')[i].classList.add('active');
                    }
                }
                
                this.updateTimelineDetails(index);
            });
        });
    }

    updateTimelineDetails(index) {
        const detailsEl = document.getElementById('phase-details');
        const phases = [
            {
                title: "Voter Registration",
                desc: "The first step is getting your name on the Electoral Roll. You need to fill Form 6 if you are a new voter.",
                action: "How to register to vote?"
            },
            {
                title: "Notification & Nomination",
                desc: "The ECI issues the election notification. Candidates then file their nomination papers, which are scrutinized for validity.",
                action: "What is the Election Commission?"
            },
            {
                title: "Model Code of Conduct & Campaigning",
                desc: "The MCC comes into effect to ensure fair play. Political parties release manifestos and campaign to win voters' support.",
                action: "What is Model Code of Conduct?"
            },
            {
                title: "Silence Period",
                desc: "Campaigning stops 48 hours before the end of polling. This gives voters time to think and decide without influence.",
                action: "What happens during silence period?"
            },
            {
                title: "Polling Day",
                desc: "Citizens cast their votes secretly at designated polling stations using EVMs and can verify it via VVPAT.",
                action: "How to vote using EVM?"
            },
            {
                title: "Counting & Results",
                desc: "EVMs are secured and votes are tallied on a scheduled day. The candidate with the most valid votes wins.",
                action: "How are results counted?"
            }
        ];

        const phase = phases[index];
        // Re-animate by changing innerHTML
        detailsEl.innerHTML = `
            <h3 class="pop-in">${phase.title}</h3>
            <p class="pop-in">${phase.desc}</p>
            <button class="action-btn pop-in mt-4" onclick="app.chatAbout('${phase.action}')">${phase.action}</button>
        `;
    }

    // --- Quiz/Gamification ---
    startQuiz() {
        document.querySelector('.quiz-state-start').style.display = 'none';
        document.querySelector('.quiz-state-result').style.display = 'none';
        document.querySelector('.quiz-state-active').style.display = 'block';
        
        this.quizState.currentQuestion = 0;
        this.quizState.score = 0;
        
        // Hide explanation if it's visible from a previous run
        const expEl = document.getElementById('quiz-explanation');
        if(expEl) {
            expEl.style.display = 'none';
            expEl.className = 'quiz-explanation';
        }
        
        this.renderQuestion();
    }

    renderQuestion() {
        const q = this.quizzes[this.quizState.currentQuestion];
        const progress = ((this.quizState.currentQuestion) / this.quizzes.length) * 100;
        
        document.getElementById('quiz-progress-text').textContent = `Question ${this.quizState.currentQuestion + 1} of ${this.quizzes.length}`;
        document.getElementById('quiz-progress-bar').style.width = `${progress}%`;
        document.getElementById('quiz-question-text').textContent = q.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        // Hide explanation for the new question
        const expEl = document.getElementById('quiz-explanation');
        if(expEl) {
            expEl.style.display = 'none';
            expEl.className = 'quiz-explanation';
        }
        
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn pop-in';
            btn.textContent = opt;
            btn.style.animationDelay = `${idx * 0.1}s`;
            btn.onclick = () => this.handleAnswer(idx, btn);
            optionsContainer.appendChild(btn);
        });
    }

    handleAnswer(selectedIndex, btnElement) {
        // Disable all options
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(btn => btn.disabled = true);
        
        const q = this.quizzes[this.quizState.currentQuestion];
        
        if (selectedIndex === q.answer) {
            btnElement.classList.add('correct');
            this.quizState.score++;
        } else {
            btnElement.classList.add('wrong');
            // Highlight correct one
            allBtns[q.answer].classList.add('correct');
        }
        
        // Show explanation
        const expEl = document.getElementById('quiz-explanation');
        const expText = document.getElementById('quiz-explanation-text');
        
        if(expEl && expText && q.explanation) {
            expText.textContent = q.explanation;
            expEl.style.display = 'block';
            expEl.classList.add('slide-up');
        }
        
        // Add a "Next Question" button instead of auto-advancing
        let nextBtn = document.getElementById('quiz-next-btn');
        if(!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.id = 'quiz-next-btn';
            nextBtn.className = 'primary-btn mt-4 pop-in';
            nextBtn.style.display = 'block';
            nextBtn.style.margin = '2rem auto 0 auto';
            document.querySelector('.quiz-state-active').appendChild(nextBtn);
        } else {
             nextBtn.style.display = 'block';
        }
        
        nextBtn.textContent = (this.quizState.currentQuestion < this.quizzes.length - 1) ? 'Next Question' : 'See Results';
        
        nextBtn.onclick = () => {
            nextBtn.style.display = 'none';
            this.quizState.currentQuestion++;
            if (this.quizState.currentQuestion < this.quizzes.length) {
                this.renderQuestion();
            } else {
                this.showQuizResult();
            }
        };
    }

    showQuizResult() {
        document.querySelector('.quiz-state-active').style.display = 'none';
        const resultEl = document.querySelector('.quiz-state-result');
        resultEl.style.display = 'block';
        
        document.getElementById('quiz-progress-bar').style.width = '100%';
        
        const percentage = (this.quizState.score / this.quizzes.length) * 100;
        
        if (percentage >= 66) {
            document.getElementById('quiz-result-title').textContent = "Incredible! Badge Unlocked! 🏆";
            document.getElementById('quiz-result-desc').textContent = `You scored ${this.quizState.score} out of ${this.quizzes.length}. You've unlocked the 'Registered' badge!`;
            
            // Unlock badge
            if(!this.userState.badges.includes('Registered')) {
                this.userState.badges.push('Registered');
                const badgeItems = document.querySelectorAll('.badge-item');
                badgeItems[1].classList.remove('locked');
                badgeItems[1].classList.add('earned');
                this.updateOverallProgress();
            }
        } else {
            document.getElementById('quiz-result-title').textContent = "Good try!";
            document.getElementById('quiz-result-desc').textContent = `You scored ${this.quizState.score} out of ${this.quizzes.length}. Keep learning in the chat and try again!`;
        }
    }

    resetQuiz() {
        this.startQuiz();
    }

    // --- FAQs ---
    setupFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all others
                faqItems.forEach(f => f.classList.remove('open'));
                
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    // --- Global Progress ---
    updateOverallProgress() {
        // Base is 25%, each topic adds 20%, each badge adds 15%
        let progress = 25;
        progress += (this.userState.topicsCovered.length * 20);
        progress += ((this.userState.badges.length - 1) * 15); // -1 because Beginner is default
        
        progress = Math.min(progress, 100); // cap at 100
        
        document.getElementById('overall-progress-text').textContent = `${progress}%`;
        document.getElementById('overall-progress-bar').style.width = `${progress}%`;
        
        // Update steps UI
        const steps = document.querySelectorAll('.progress-steps .step');
        if (this.userState.topicsCovered.includes('registration')) {
            steps[1].classList.remove('active');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
        }
        if (this.userState.topicsCovered.includes('voting')) {
            steps[2].classList.remove('active');
            steps[2].classList.add('completed');
            steps[3].classList.add('active');
        }
    }

    // Utils
    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}

// Initialize App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ElectionApp();
});
