/**
 * @biosstel/api-shared - Domain Layer: Email Value Object
 * 
 * Value object representing an email address.
 * Provides validation and immutability.
 */

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error('Email is required');
    }
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
    this._value = value.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
