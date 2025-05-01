import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageSwitcher from '../LanguageSwitcher';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage('en');
  });

  function renderWithI18n() {
    return render(
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
      </I18nextProvider>
    );
  }

  it('affiche la langue courante', () => {
    renderWithI18n();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('affiche toutes les langues dans le menu', () => {
    renderWithI18n();
    fireEvent.click(screen.getByRole('button', { name: /change language/i }));
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
    expect(screen.getByText('Italiano')).toBeInTheDocument();
  });

  it('change la langue au clic', () => {
    renderWithI18n();
    fireEvent.click(screen.getByRole('button', { name: /change language/i }));
    fireEvent.click(screen.getByText('Français'));
    expect(i18n.language).toBe('fr');
    expect(localStorage.getItem('i18nextLng')).toBe('fr');
  });
});
