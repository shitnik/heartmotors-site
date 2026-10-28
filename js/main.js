// ============================================================
// Логика главной страницы.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('#mobile-menu');
  const navigation = document.querySelector('.main-nav');

  // Открывает и закрывает мобильное меню.
  menuButton?.addEventListener('click', () => {
    navigation.classList.toggle('open');
  });

  // После перехода по якорю мобильное меню закрывается.
  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navigation.classList.remove('open'));
  });

  // Отправляет заявку на консультацию в PHP API.
  // Если API ещё не подключён, сохраняет заявку локально для тестирования.
  document.querySelectorAll('#hero-form, #request-form').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const message = form.querySelector('.form-message');
      const values = Object.fromEntries(new FormData(form));
      const lead = {
        name: String(values.name || '').trim(),
        email: String(values.email || '').trim(),
        phone: String(values.phone || '').trim(),
        car: String(values.car || '').trim(),
        comment: String(values.comment || '').trim(),
        source: form.id,
        createdAt: new Date().toISOString(),
      };
      const apiUrl = window.HEARTMOTORS_LEAD_API_URL || '';

      if (message) {
        message.textContent = 'Отправка…';
      }

      try {
        if (apiUrl) {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          });

          if (!response.ok) {
            throw new Error('Не удалось отправить заявку');
          }
        } else {
          const localLeads = JSON.parse(
            localStorage.getItem('heartmotors_leads') || '[]',
          );

          localLeads.push(lead);
          localStorage.setItem('heartmotors_leads', JSON.stringify(localLeads));
        }

        if (message) {
          message.textContent = 'Запрос успешно добавлен';
        }
        form.reset();
      } catch (error) {
        console.error(error);

        if (message) {
          message.textContent = 'Не удалось отправить запрос. Попробуйте ещё раз.';
        }
      }
    });
  });

  // Данные отзывов для слайдера.
  const reviews = [
    {
      text: '«Отличный выбор! Двигатель работает как часы, очень довольна покупкой.»',
      author: 'Елена Смирнова',
      role: 'Автолюбитель',
      image: 'https://static.tildacdn.ink/tild6365-3064-4563-b562-383834623762/image_-7.png',
    },
    {
      text: '«Надёжный и мощный двигатель, который оправдал все ожидания. Рекомендую!»',
      author: 'Иван Петров',
      role: 'Профессиональный автогонщик',
      image: 'https://static.tildacdn.ink/tild6261-6133-4462-a237-323566373436/image_-5.png',
    },
    {
      text: '«Качественный продукт по разумной цене. Очень довольна покупкой и сервисом.»',
      author: 'Мария Васильева',
      role: 'Владелец автомагазина',
      image: 'https://static.tildacdn.ink/tild3432-3163-4535-a238-376531386437/image_.png',
    },
  ];

  const reviewText = document.querySelector('#review-text');
  const reviewAuthor = document.querySelector('#review-author');
  const reviewRole = document.querySelector('#review-role');
  const reviewDots = document.querySelector('#review-dots');
  let currentReview = 0;

  // Показывает выбранный отзыв и отмечает активную точку.
  function showReview(index) {
    currentReview = (index + reviews.length) % reviews.length;
    const review = reviews[currentReview];

    if (reviewText) reviewText.textContent = review.text;
    if (reviewAuthor) reviewAuthor.textContent = review.author;
    if (reviewRole) reviewRole.textContent = review.role;

    const reviewAvatar = document.querySelector('.review-avatar');
    if (reviewAvatar && review.image) {
      reviewAvatar.style.backgroundImage = `url("${review.image}")`;
    }

    if (reviewDots) {
      [...reviewDots.children].forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentReview);
      });
    }
  }

  // Создаёт три точки-переключателя под отзывом.
  if (reviewDots) {
    reviews.forEach((_, index) => {
      const dot = document.createElement('button');

      dot.className = 'review-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Показать отзыв ${index + 1}`);
      dot.addEventListener('click', () => showReview(index));
      reviewDots.append(dot);
    });

    showReview(0);
  }

  document.querySelector('.review-prev')?.addEventListener('click', () => {
    showReview(currentReview - 1);
  });

  document.querySelector('.review-next')?.addEventListener('click', () => {
    showReview(currentReview + 1);
  });
});
