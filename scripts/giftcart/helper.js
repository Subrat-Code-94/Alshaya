import { validateInput } from '../forms.js';
import { getConfigValue } from '../configs.js';

export function getTopUpAmount(topUpOptionsRadios, customAmountInput) {
  const selectedRadio = [...topUpOptionsRadios].find((radio) => radio.checked);
  return selectedRadio ? selectedRadio.value : customAmountInput.value;
}

export function enableTopUpButton(
  form,
  customAmountInput,
  topUpOptionsRadios,
  egiftTopUpButton,
  egiftCardNumberInput = false,
) {
  const customAmount = customAmountInput.value;
  const topUpAmountSelected = [...topUpOptionsRadios].some((radio) => radio.checked);
  let isValidEgiftCardNumber = true;

  if (egiftCardNumberInput) {
    isValidEgiftCardNumber = validateInput(egiftCardNumberInput);
  }

  const shouldEnableButton = isValidEgiftCardNumber && (topUpAmountSelected || customAmount);

  egiftTopUpButton.disabled = !shouldEnableButton;
}

export async function getTopUpOptions() {
  const topUpOptions = await getConfigValue('egift-top-up-options') || '5,10,15,25,50,75,100,500';
  return topUpOptions.split(',');
}
