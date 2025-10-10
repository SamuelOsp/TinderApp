import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { IonInputCustomEvent, InputInputEventDetail } from '@ionic/core/components'; 

type InputType = 'text' | 'email' | 'password' | 'number';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }],
  standalone: false,
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() label = '';
  @Input() placeholder = '';

  value = '';
  disabled = false;
  focused = false;

  private onChange = (v: any) => {};
  private onTouched = () => {};

  writeValue(v: any): void { this.value = v ?? ''; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  onInputChange(ev: IonInputCustomEvent<InputInputEventDetail>) {
    const newValue = ev.detail.value ?? '';
    this.value = newValue;
    this.onChange(newValue);
  }

  onFocus() { this.focused = true; }
  onBlur()  { this.focused = false; this.onTouched(); }
}
