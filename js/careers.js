import { wire, emailOk, phoneOk } from './forms.js';
import { fileToBase64 } from './store.js';

const MAX = 5 * 1024 * 1024;

export function mountCareerForm(el) {
  el.innerHTML = `
    <form class="form" novalidate>
      <label>Full Name<input name="name" autocomplete="name" required></label>
      <label>Your Email (optional)<input name="email" type="email" autocomplete="email" inputmode="email"></label>
      <label>Your Mobile Number<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required></label>
      <label>Position You Are Applying For<input name="position" required></label>
      <label>Upload Your Resume/CV (PDF, DOC, DOCX | Max 5MB)<input name="resume" type="file" accept=".pdf,.doc,.docx" required></label>
      <label>Your Message / Cover Letter (optional)<textarea name="message" rows="6"></textarea></label>
      <p class="msg-line" role="alert" aria-live="polite"></p>
      <button class="btn block" type="submit">Apply Now</button>
    </form>`;
  wire(el.querySelector('form'), {
    success: 'Application received. We will contact you if your profile matches an opening.',
    validate: (f) => {
      const v = (n) => f.elements[n].value.trim();
      const file = f.elements.resume.files[0];
      if (v('name').length < 2) return 'Enter your full name.';
      if (v('email') && !emailOk(v('email'))) return 'Enter a valid email address or leave it empty.';
      if (!phoneOk(v('phone'))) return 'Enter a valid mobile number.';
      if (v('position').length < 2) return 'Enter the position you are applying for.';
      if (!file) return 'Attach your resume.';
      if (!/\.(pdf|doc|docx)$/i.test(file.name)) return 'Resume must be a PDF, DOC or DOCX file.';
      if (file.size > MAX) return 'Resume must be 5 MB or smaller.';
    },
    build: async (f) => {
      const v = (n) => f.elements[n].value.trim();
      const file = f.elements.resume.files[0];
      return {
        type: 'career', name: v('name'), email: v('email').toLowerCase(), phone: v('phone'), position: v('position'), message: v('message'),
        resumeName: file.name, resumeType: file.type || 'application/octet-stream', resumeSize: file.size, resumeData: await fileToBase64(file),
      };
    },
  });
}
