document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('moveOutForm');
  const errorBanner = document.getElementById('errorBanner');
  const successScreen = document.getElementById('successScreen');
  const summary = document.getElementById('summary');

  // Show/hide extension field
  document.querySelectorAll('input[name="extendStay"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const field = document.getElementById('extensionField');
      if (radio.value === 'yes') {
        field.classList.add('visible');
      } else {
        field.classList.remove('visible');
        document.getElementById('extensionDuration').value = '';
      }
    });
  });

  // Highlight selected cleaning option
  document.querySelectorAll('.cleaning-option input').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.cleaning-option').forEach(el => el.classList.remove('selected'));
      radio.closest('.cleaning-option').classList.add('selected');
    });
  });

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('moveOutDate').setAttribute('min', today);

  // Validation & submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorBanner.classList.remove('visible');

    // Clear previous error styles
    form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    form.querySelectorAll('.error-highlight').forEach(el => el.classList.remove('error-highlight'));

    let valid = true;
    let firstError = null;

    function flagField(el) {
      if (el) el.classList.add('field-error');
      valid = false;
      if (!firstError) firstError = el;
    }

    // 1. Date & time
    const dateInput = document.getElementById('moveOutDate');
    if (!dateInput.value) flagField(dateInput);

    const timeInput = document.getElementById('moveOutTime');
    if (!timeInput.value) flagField(timeInput);

    // 2. Extend stay
    if (!document.querySelector('input[name="extendStay"]:checked')) {
      valid = false;
      if (!firstError) firstError = document.querySelector('input[name="extendStay"]').closest('.form-section');
    }

    // Extension duration if yes
    const extendVal = document.querySelector('input[name="extendStay"]:checked');
    if (extendVal && extendVal.value === 'yes') {
      const dur = document.getElementById('extensionDuration');
      if (!dur.value.trim()) flagField(dur);
    }

    // 3. Satisfaction
    if (!document.querySelector('input[name="satisfaction"]:checked')) {
      valid = false;
      if (!firstError) firstError = document.querySelector('input[name="satisfaction"]').closest('.form-section');
    }

    // 4. Referral
    if (!document.querySelector('input[name="referral"]:checked')) {
      valid = false;
      if (!firstError) firstError = document.querySelector('input[name="referral"]').closest('.form-section');
    }

    // 5. Cleaning option
    if (!document.querySelector('input[name="cleaningOption"]:checked')) {
      valid = false;
      if (!firstError) firstError = document.querySelector('input[name="cleaningOption"]').closest('.form-section');
    }


    if (!valid) {
      errorBanner.classList.add('visible');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Collect data & show success
    const data = {
      date: dateInput.value,
      time: timeInput.value,
      extend: extendVal.value,
      extensionDuration: document.getElementById('extensionDuration').value || null,
      satisfaction: document.querySelector('input[name="satisfaction"]:checked').value,
      referral: document.querySelector('input[name="referral"]:checked').value,
      cleaning: document.querySelector('input[name="cleaningOption"]:checked').value,
    };

    console.log('Submitted:', data);

    const cleaningLabels = {
      'self-clean': 'Tenant will clean',
      'company-clean': 'Company cleaning ($150 deduction)',
    };

    const rows = [
      ['Move-out date', formatDate(data.date)],
      ['Move-out time', data.time],
      ['Extend stay', data.extend === 'yes' ? 'Yes - ' + data.extensionDuration : 'No'],
      ['Satisfaction', data.satisfaction.replace('-', ' ')],
      ['Would refer/return', data.referral === 'yes' ? 'Yes' : 'No'],
      ['Room condition', cleaningLabels[data.cleaning]],
    ];

    summary.innerHTML = rows.map(([label, value]) =>
      `<div class="summary-row"><span class="summary-label">${label}</span><span class="summary-value">${value}</span></div>`
    ).join('');

    form.style.display = 'none';
    successScreen.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function formatDate(str) {
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  }
});
