import React from 'react';
import { Calendar, User, Clock, Phone, Mail, MapPin, Globe } from 'lucide-react';

const BRAND_ICONS = {
  github: (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="contact-icon-svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
};

const LUCIDE_CONTACT_ICONS = {
  age: Calendar,
  gender: User,
  arrivalTime: Clock,
  phone: Phone,
  email: Mail,
  location: MapPin,
  website: Globe
};

export default function ContactItems({ personal = {}, format = 'icon', onUpdate }) {
  if (!personal || typeof personal !== 'object') return null;

  if (format === 'label') {
    const labelContacts = [
      ['age', '年 龄：'], ['gender', '性 别：'], ['phone', '电 话：'],
      ['email', '邮 箱：'], ['location', '地 区：'], ['arrivalTime', '到 岗：'],
      ['github', 'GitHub：'], ['linkedin', 'LinkedIn：'], ['website', '网 站：']
    ];

    return (
      <>
        {labelContacts.map(([field, label]) => {
          const val = personal[field];
          if (!val) return null;
          return (
            <div key={field} className="contact-item">
              <span className="contact-label">{label}</span>
              <span
                contentEditable
                suppressContentEditableWarning
                data-path={`personal.${field}`}
                onBlur={(e) => onUpdate && onUpdate(field, e.currentTarget.textContent)}
              >
                {val}
              </span>
            </div>
          );
        })}
      </>
    );
  }

  const iconContacts = [
    ['age', 'age'], ['gender', 'gender'], ['arrivalTime', 'arrivalTime'],
    ['phone', 'phone'], ['email', 'email'], ['location', 'location'], ['website', 'website'],
    ['github', 'github'], ['linkedin', 'linkedin']
  ];

  return (
    <>
      {iconContacts.map(([field, iconKey]) => {
        const val = personal[field];
        if (!val) return null;

        const BrandIcon = BRAND_ICONS[field];
        const LucideIcon = LUCIDE_CONTACT_ICONS[iconKey];

        return (
          <div key={field} className="contact-item">
            {BrandIcon || (LucideIcon ? <LucideIcon size={12} /> : null)}
            <span
              contentEditable
              suppressContentEditableWarning
              data-path={`personal.${field}`}
              onBlur={(e) => onUpdate && onUpdate(field, e.currentTarget.textContent)}
            >
              {val}
            </span>
          </div>
        );
      })}
    </>
  );
}
