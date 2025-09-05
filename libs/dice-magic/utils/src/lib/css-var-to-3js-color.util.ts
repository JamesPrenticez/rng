import * as THREE from 'three';

export const cssVarTo3jsColor = (varString: string, element: HTMLElement = document.documentElement) => {
  const match = varString.match(/var\((--[\w-]+)\)/);
  if (!match) {
    console.warn(`Invalid CSS var string: ${varString}`);
    return new THREE.Color('#ffffff');
  }

  const varName = match[1];
  const style = getComputedStyle(element);

  let value = style.getPropertyValue(varName).trim();

  // Resolve nested var() if present
  const nestedMatch = value.match(/var\((--[\w-]+)\)/);
  if (nestedMatch) {
    const nestedVar = nestedMatch[1];
    const nestedValue = style.getPropertyValue(nestedVar).trim();
    if (nestedValue) value = `rgb(${nestedValue})`;
    else value = '#ffffff';
  }

  return new THREE.Color(value || '#ffffff');
};