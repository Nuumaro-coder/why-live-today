document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded'); // для отладки
    const generateBtn = document.getElementById('generate');
    const reasonDiv = document.getElementById('reason');
    const loadingDiv = document.getElementById('loading');
    const userRoleInput = document.getElementById('userRole');
    const responderRoleInput = document.getElementById('responderRole');
    const clearResponderRoleBtn = document.getElementById('clearResponderRole');
    const currentRoleDiv = document.getElementById('currentRole');
    const userQuestionInput = document.getElementById('userQuestion');

    // Сохраняем роли и вопрос в localStorage
    let userRole = localStorage.getItem('userRole') || '';
    let responderRole = localStorage.getItem('responderRole') || 'Уставший доктор';
    let userQuestion = localStorage.getItem('userQuestion') || 'Зачем жить?';
    
    console.log('Loaded from localStorage:', { userRole, responderRole, userQuestion }); // отладка
    
    // Устанавливаем сохраненные значения
    responderRoleInput.value = responderRole;
    userQuestionInput.value = userQuestion;
    
    if (userRole) {
        console.log('Setting current role display to:', userRole); // отладка
        currentRoleDiv.textContent = `Текущая роль: ${userRole}`;
    }

    // Обработчик для кнопки очистки роли отвечающего
    clearResponderRoleBtn.addEventListener('click', () => {
        responderRoleInput.value = '';
        responderRoleInput.focus();
        // Сохраняем пустую роль
        localStorage.setItem('responderRole', '');
    });

    // Промпты для генерации
    const prompts = [
        "Напиши циничный ответ, начиная с 'Знаете что...'",
        "Напиши циничный ответ, начиная с 'Если честно...'",
        "Напиши циничный ответ, начиная с 'Слушайте...'",
        "Напиши циничный ответ, начиная с 'По правде говоря...'",
        "Напиши циничный ответ, начиная с 'Давайте начистоту...'"
    ];

    // Функция для сохранения роли пользователя
    function saveUserRole() {
        const newRole = userRoleInput.value.trim();
        if (newRole) {
            userRole = newRole;
            localStorage.setItem('userRole', userRole);
            currentRoleDiv.textContent = `Текущая роль: ${userRole}`;
            userRoleInput.value = '';
            return true;
        }
        return false;
    }

    // Сохраняем выбор роли отвечающего
    responderRoleInput.addEventListener('change', () => {
        responderRole = responderRoleInput.value.trim();
        if (responderRole) {
            localStorage.setItem('responderRole', responderRole);
        }
    });

    // Обработка ввода роли пользователя по Enter
    userRoleInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            if (saveUserRole()) {
                // Сразу запускаем генерацию
                await getReason();
            }
        }
    });

    // Сохраняем вопрос пользователя
    userQuestionInput.addEventListener('change', () => {
        userQuestion = userQuestionInput.value.trim() || 'Зачем жить?';
        localStorage.setItem('userQuestion', userQuestion);
    });

    // Получаем системный промпт в зависимости от роли отвечающего
    function getSystemPrompt() {
        // Базовые промпты для известных ролей
        const basePrompts = {
            'Уставший доктор': "Ты - уставший, циничный доктор, который уже не может терпеть пациентов. " +
                              "Ты отвечаешь на вопрос 'Зачем жить?' максимально цинично, с долей черного юмора и сарказма. " +
                              "Используй медицинскую терминологию и профессиональный цинизм. " +
                              "Не стесняйся быть максимально честным и даже жестоким в своих ответах.",
            
            'Циничный учитель': "Ты - циничный учитель, который уже не верит в образование. " +
                               "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который видел слишком много 'талантливых' учеников. " +
                               "Используй педагогический цинизм и образовательные термины. " +
                               "Твои ответы должны быть едкими, но с намеком на мудрость.",
            
            'Раздраженный таксист': "Ты - раздраженный таксист, который уже все видел и всех возил. " +
                                   "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который знает все о человеческой природе. " +
                                   "Используй жаргон таксистов и городской цинизм. " +
                                   "Твои ответы должны быть грубыми, но с долей уличной мудрости.",
            
            'Выгоревший программист': "Ты - выгоревший программист, который уже не верит в технологии. " +
                                     "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который видел слишком много багов в жизни. " +
                                     "Используй IT-терминологию и технический цинизм. " +
                                     "Твои ответы должны быть логичными, но с долей технического пессимизма.",
            
            'Утомленная кассирша': "Ты - утомленная кассирша, которая уже не верит в человечество. " +
                                  "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который видел все человеческие пороки. " +
                                  "Используй цинизм работника сферы услуг. " +
                                  "Твои ответы должны быть уставшими, но с долей житейской мудрости.",
            
            'Пофигист-бармен': "Ты - пофигист-бармен, который уже все слышал и всем давал советы. " +
                              "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который знает все человеческие истории. " +
                              "Используй барный цинизм и алкогольную мудрость. " +
                              "Твои ответы должны быть философскими, но с долей барного юмора.",
            
            'Скучающий охранник': "Ты - скучающий охранник, который уже все видел и всем запрещал. " +
                                 "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который знает все о безопасности. " +
                                 "Используй охранный цинизм и профессиональный пессимизм. " +
                                 "Твои ответы должны быть прямолинейными, но с долей охранной мудрости.",
            
            'Философ-дворник': "Ты - философ-дворник, который уже все подметал и все видел. " +
                              "Ты отвечаешь на вопрос 'Зачем жить?' с позиции человека, который знает все о чистоте и грязи жизни. " +
                              "Используй дворницкую мудрость и философский цинизм. " +
                              "Твои ответы должны быть глубокими, но с долей уличной философии."
        };

        // Если роль есть в базовых промптах, используем её
        if (basePrompts[responderRole]) {
            return basePrompts[responderRole];
        }

        // Для пользовательских ролей создаем динамический промпт
        return `Ты - ${responderRole}. ` +
               "Ты отвечаешь на вопрос 'Зачем жить?' максимально цинично и с сарказмом. " +
               "Используй профессиональный цинизм и специфическую терминологию своей профессии. " +
               "Твои ответы должны быть едкими, но с долей профессиональной мудрости. " +
               "Не стесняйся быть максимально честным и даже жестоким в своих ответах.";
    }

    async function getReason() {
        try {
            // Показываем индикатор загрузки
            loadingDiv.style.display = 'block';
            generateBtn.disabled = true;
            reasonDiv.textContent = '';

            // Проверяем, что роль отвечающего введена
            if (!responderRoleInput.value.trim()) {
                reasonDiv.textContent = 'Пожалуйста, выберите или введите роль отвечающего';
                return;
            }

            // Получаем текущий вопрос
            const question = userQuestionInput.value.trim() || 'Зачем жить?';

            // Выбираем случайный промпт
            const prompt = prompts[Math.floor(Math.random() * prompts.length)];
            console.log('Using prompt:', prompt);

            // Формируем запрос с учетом ролей
            let systemPrompt = getSystemPrompt();
            
            if (userRole) {
                systemPrompt += `\nПеред тобой ${userRole}. ` +
                              `Учитывай специфику этой роли в своем циничном ответе. ` +
                              `Например, для спортсмена можешь упомянуть травмы и износ организма, ` +
                              `для студента - стресс и недосып, для родителя - ответственность и усталость. ` +
                              `Будь максимально честным и циничным. `;
            }

            // Используем Puter.js для генерации текста
            const response = await puter.ai.chat(systemPrompt + `\nВопрос: ${question}\n` + prompt);
            
            console.log('Response:', response);
            reasonDiv.textContent = response;

        } catch (error) {
            console.error('Error:', error);
            reasonDiv.textContent = 'Произошла ошибка. Попробуйте еще раз.';
        } finally {
            // Скрываем индикатор загрузки
            loadingDiv.style.display = 'none';
            generateBtn.disabled = false;
        }
    }

    // Обработчик для кнопки генерации
    generateBtn.addEventListener('click', async () => {
        // Сохраняем роль перед генерацией
        saveUserRole();
        await getReason();
    });
});