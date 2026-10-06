/**
 * Autocompletado y Validación de Direcciones IP (IPv6 / IPv4)
 * Electiva: Desarrollo de Aplicaciones Web - Universidad del Cauca
 * Autor: Luis Miguel Gomez
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM
  const ipInput = document.getElementById('ip-input');
  const inputWrapper = document.getElementById('input-wrapper');
  const statusMessage = document.getElementById('status-message');
  const statusText = statusMessage.querySelector('.status-text');
  const statusIcon = document.getElementById('status-icon');
  
  const tabIPv6 = document.getElementById('tab-ipv6');
  const tabIPv4 = document.getElementById('tab-ipv4');
  const separatorSelect = document.getElementById('separator-select');
  const autoFormatToggle = document.getElementById('auto-format-toggle');
  const separatorOptionsGroup = document.getElementById('separator-options');
  
  const fieldLabel = document.getElementById('field-label');
  const formatHint = document.getElementById('format-hint');
  
  const blocksCountEl = document.getElementById('blocks-count');
  const blocksDetailEl = document.getElementById('blocks-detail');
  const compressionStatusEl = document.getElementById('compression-status');
  const compressionDetailEl = document.getElementById('compression-detail');
  const ipTypeEl = document.getElementById('ip-type');
  const ipTypeDetailEl = document.getElementById('ip-type-detail');
  
  const btnClear = document.getElementById('btn-clear');
  const btnCopy = document.getElementById('btn-copy');
  const validExamplesContainer = document.getElementById('valid-examples');
  const invalidExamplesContainer = document.getElementById('invalid-examples');
  const toast = document.getElementById('toast');

  // Estado de la aplicación
  let currentMode = 'ipv6'; // 'ipv6' | 'ipv4'
  let isBackspace = false;

  // =========================================================================
  // Configuración por Protocolo
  // =========================================================================
  const config = {
    ipv6: {
      placeholder: 'Ej: 2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      label: 'Dirección IPv6',
      hint: 'Formato: 8 bloques hex (0-9, a-f) separados por ":" o "::"',
      defaultSeparator: ':',
      allowedChars: /^[0-9a-fA-F:.]+$/,
      validExamples: [
        { label: 'Completa', ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
        { label: 'Comprimida', ip: '2001:db8::1' },
        { label: 'Link-Local', ip: 'fe80::1ff:fe23:4567:890a' },
        { label: 'Loopback (::1)', ip: '::1' }
      ],
      invalidExamples: [
        { label: '9 Bloques (+ de 8)', ip: '2001:0db8:85a3:0000:0000:8a2e:0370:7334:1111' },
        { label: 'Carácter no Hex (xyz)', ip: '2001:xyz::1' },
        { label: 'Doble compresión (::...::)', ip: '2001::db8::1' },
        { label: 'Bloque con 5 dígitos', ip: '12345::1' }
      ]
    },
    ipv4: {
      placeholder: 'Ej: 192.168.1.100',
      label: 'Dirección IPv4',
      hint: 'Formato: 4 octetos decimales (0-255) separados por "."',
      defaultSeparator: '.',
      allowedChars: /^[0-9.]+$/,
      validExamples: [
        { label: 'Clase C Privada', ip: '192.168.1.1' },
        { label: 'Clase A Privada', ip: '10.0.0.1' },
        { label: 'DNS Google', ip: '8.8.8.8' },
        { label: 'Loopback', ip: '127.0.0.1' }
      ],
      invalidExamples: [
        { label: 'Octeto > 255', ip: '192.168.1.256' },
        { label: '5 Octetos', ip: '192.168.1.1.5' },
        { label: 'Letras en octeto', ip: '192.168.1.abc' },
        { label: 'Cero al inicio (01)', ip: '192.168.01.1' }
      ]
    }
  };

  // =========================================================================
  // Cambio de Pestañas (Modo IPv6 / IPv4)
  // =========================================================================
  function switchMode(mode) {
    currentMode = mode;
    const isIPv6 = mode === 'ipv6';

    tabIPv6.classList.toggle('active', isIPv6);
    tabIPv6.setAttribute('aria-selected', isIPv6);
    tabIPv4.classList.toggle('active', !isIPv6);
    tabIPv4.setAttribute('aria-selected', !isIPv6);

    // Ajustar visibilidad y opciones del separador
    if (isIPv6) {
      separatorOptionsGroup.style.display = 'flex';
      separatorSelect.value = ':';
    } else {
      separatorOptionsGroup.style.display = 'none';
      separatorSelect.value = '.';
    }

    // Actualizar labels y placeholders
    fieldLabel.childNodes[0].nodeValue = `${config[mode].label} `;
    formatHint.textContent = config[mode].hint;
    ipInput.placeholder = config[mode].placeholder;
    ipInput.value = '';

    // Actualizar chips de prueba
    renderExamples(mode);

    // Resetear validación
    updateValidation();
    ipInput.focus();
  }

  function renderExamples(mode) {
    validExamplesContainer.innerHTML = '';
    invalidExamplesContainer.innerHTML = '';

    config[mode].validExamples.forEach(item => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip chip-valid';
      chip.textContent = item.label;
      chip.dataset.ip = item.ip;
      chip.addEventListener('click', () => loadExample(item.ip));
      validExamplesContainer.appendChild(chip);
    });

    config[mode].invalidExamples.forEach(item => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip chip-invalid';
      chip.textContent = item.label;
      chip.dataset.ip = item.ip;
      chip.addEventListener('click', () => loadExample(item.ip));
      invalidExamplesContainer.appendChild(chip);
    });
  }

  function loadExample(ip) {
    ipInput.value = ip;
    updateValidation();
    showToast(`Ejemplo cargado: ${ip}`);
  }

  // =========================================================================
  // Manejo de Entrada y Autocompletado de Puntos / Dos Puntos
  // =========================================================================
  ipInput.addEventListener('keydown', (e) => {
    isBackspace = (e.key === 'Backspace' || e.key === 'Delete');

    // Manejo fluido de retroceso cerca de separadores
    if (e.key === 'Backspace' && !e.ctrlKey && !e.metaKey) {
      const start = ipInput.selectionStart;
      const end = ipInput.selectionEnd;
      if (start === end && start > 0) {
        const charBefore = ipInput.value[start - 1];
        const sep = separatorSelect.value;
        if (charBefore === ':' || charBefore === '.') {
          // Si el usuario borra justo después del separador, eliminar el separador y el carácter previo
          e.preventDefault();
          const val = ipInput.value;
          ipInput.value = val.slice(0, start - 1) + val.slice(start);
          ipInput.setSelectionRange(start - 1, start - 1);
          updateValidation();
          return;
        }
      }
    }

    // Atajo: si en IPv6 el usuario presiona '.' en el teclado numérico,
    // convertirlo automáticamente en el separador configurado (':' por defecto)
    if (currentMode === 'ipv6' && e.key === '.') {
      const sep = separatorSelect.value;
      if (sep === ':') {
        e.preventDefault();
        insertAtCursor(':');
      }
    }
  });

  ipInput.addEventListener('input', (e) => {
    const autoFormat = autoFormatToggle.checked;
    let raw = ipInput.value;

    if (autoFormat && !isBackspace && e.inputType !== 'deleteContentBackward') {
      const sep = separatorSelect.value;
      
      if (currentMode === 'ipv6') {
        ipInput.value = formatIPv6Input(raw, sep);
      } else {
        ipInput.value = formatIPv4Input(raw);
      }
    }

    updateValidation();
  });

  function insertAtCursor(text) {
    const start = ipInput.selectionStart;
    const end = ipInput.selectionEnd;
    const val = ipInput.value;
    
    // Evitar más de dos colons consecutivos
    if (text === ':' && val.slice(Math.max(0, start - 2), start) === '::') {
      return;
    }

    ipInput.value = val.slice(0, start) + text + val.slice(end);
    ipInput.setSelectionRange(start + text.length, start + text.length);
    updateValidation();
  }

  // =========================================================================
  // Algoritmo de Autocompletado / Puntuación Asistida
  // =========================================================================
  function formatIPv6Input(val, sep) {
    let clean = val;
    const doubleSep = sep + sep;

    if (sep === ':') {
      clean = clean.replace(/\./g, ':');
      clean = clean.replace(/[^0-9a-fA-F:]/g, '');
      clean = clean.replace(/:{3,}/g, '::');
    } else {
      // Si el usuario configuró punto (.) como separador
      clean = clean.replace(/:/g, '.');
      clean = clean.replace(/[^0-9a-fA-F.]/g, '');
      clean = clean.replace(/\.{3,}/g, '..');
    }

    // Auto-inserción del separador al completar 4 caracteres hexadecimales en el último bloque
    const parts = clean.split(sep);
    const lastPart = parts[parts.length - 1];

    // Solo agregar separador si el último bloque llegó a 4 caracteres y hay menos de 8 bloques
    if (lastPart.length === 4 && parts.length < 8 && !clean.endsWith(doubleSep)) {
      clean += sep;
    }

    return clean;
  }

  function formatIPv4Input(val) {
    // Filtrar solo dígitos y puntos
    let clean = val.replace(/[^0-9.]/g, '');
    clean = clean.replace(/\.{2,}/g, '.');

    const parts = clean.split('.');
    const lastPart = parts[parts.length - 1];

    // Si el último octeto tiene 3 dígitos o el valor actual ya no puede aceptar más dígitos
    if (lastPart.length === 3 && parts.length < 4) {
      clean += '.';
    }

    return clean;
  }

  // =========================================================================
  // Validación y Clasificación de Direcciones IP
  // =========================================================================
  function updateValidation() {
    const val = ipInput.value.trim();

    if (!val) {
      setNeutralState();
      return;
    }

    const sep = separatorSelect.value;
    let result;

    if (currentMode === 'ipv6') {
      result = validateIPv6(val, sep);
    } else {
      result = validateIPv4(val);
    }

    if (result.isValid) {
      setValidState(result.message, result.details);
    } else {
      setInvalidState(result.message, result.details);
    }
  }

  function validateIPv6(ip, chosenSep) {
    // Normalizar si se usa punto alternativo
    let normalized = ip;
    if (chosenSep === '.') {
      normalized = ip.replace(/\./g, ':');
    }

    // Caracteres válidos
    if (!/^[0-9a-fA-F:]+$/.test(normalized)) {
      return {
        isValid: false,
        message: 'Contiene caracteres no válidos. Solo se admiten dígitos hexadecimales (0-9, a-f, A-F) y ":"',
        details: { count: 'Inválido', compression: 'Error', type: 'Carácter inválido' }
      };
    }

    // Verificar múltiples ::
    const doubleColons = normalized.match(/::/g);
    if (doubleColons && doubleColons.length > 1) {
      return {
        isValid: false,
        message: 'Solo se permite una compresión de ceros "::" en la dirección IPv6.',
        details: { count: 'Inválido', compression: 'Múltiple (::)', type: 'Inválida' }
      };
    }

    if (normalized.includes(':::')) {
      return {
        isValid: false,
        message: 'No se permiten tres o más separadores seguidos (:::).',
        details: { count: 'Inválido', compression: 'Inválida', type: 'Inválida' }
      };
    }

    const hasCompression = normalized.includes('::');
    let totalBlocks = 0;

    if (hasCompression) {
      const parts = normalized.split('::');
      const left = parts[0] ? parts[0].split(':') : [];
      const right = parts[1] ? parts[1].split(':') : [];
      const all = [...left, ...right];
      totalBlocks = all.length;

      // Un caso especial es '::' (dirección no especificada)
      if (normalized === '::') {
        return {
          isValid: true,
          message: 'Dirección IPv6 válida: Dirección no especificada (::)',
          details: { count: '0 / 8 (Comprimida)', compression: 'Detectada (::)', type: 'Unspecified Address (::)' }
        };
      }

      if (all.length > 7) {
        return {
          isValid: false,
          message: `Demasiados bloques con compresión: ${all.length} bloques encontrados (máximo 7 permitidos al usar "::").`,
          details: { count: `${all.length} / 8`, compression: 'Detectada (::)', type: 'Inválida' }
        };
      }

      for (let i = 0; i < all.length; i++) {
        const b = all[i];
        if (b.length === 0 || b.length > 4) {
          return {
            isValid: false,
            message: `Bloque "${b || 'vacío'}" fuera de tamaño (debe tener entre 1 y 4 caracteres hexadecimales).`,
            details: { count: `${all.length} / 8`, compression: 'Detectada (::)', type: 'Inválida' }
          };
        }
      }

      const typeInfo = classifyIPv6(normalized);
      return {
        isValid: true,
        message: `Dirección IPv6 válida (formato comprimido con ${all.length} hextetos explícitos).`,
        details: { count: `${all.length} / 8 (Comprimida)`, compression: 'Detectada (::)', type: typeInfo }
      };

    } else {
      // Notación completa sin compresión
      const blocks = normalized.split(':');
      totalBlocks = blocks.length;

      if (blocks.length < 8) {
        return {
          isValid: false,
          message: `Formato incompleto: se tienen ${blocks.length} de los 8 bloques requeridos (o use "::" para comprimir).`,
          details: { count: `${blocks.length} / 8`, compression: 'No detectada', type: 'Incompleta' }
        };
      }

      if (blocks.length > 8) {
        return {
          isValid: false,
          message: `Demasiados bloques: se ingresaron ${blocks.length} bloques (el estándar solo admite 8).`,
          details: { count: `${blocks.length} / 8`, compression: 'No detectada', type: 'Inválida' }
        };
      }

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.length === 0 || b.length > 4) {
          return {
            isValid: false,
            message: `Bloque #${i + 1} ("${b || 'vacío'}") inválido. Debe tener entre 1 y 4 dígitos hexadecimales.`,
            details: { count: `${blocks.length} / 8`, compression: 'No detectada', type: 'Inválida' }
          };
        }
      }

      const typeInfo = classifyIPv6(normalized);
      return {
        isValid: true,
        message: 'Dirección IPv6 válida: Estructura completa de 8 bloques de 16 bits (128 bits totales).',
        details: { count: '8 / 8 bloques', compression: 'No requerida', type: typeInfo }
      };
    }
  }

  function classifyIPv6(ip) {
    const lower = ip.toLowerCase();
    if (lower === '::1') return 'Loopback (Localhost ::1)';
    if (lower === '::') return 'Unspecified (No especificada ::)';
    if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) {
      return 'Link-Local Unicast (fe80::/10)';
    }
    if (lower.startsWith('fc') || lower.startsWith('fd')) {
      return 'Unique Local Address - ULA (fc00::/7)';
    }
    if (lower.startsWith('ff')) {
      return 'Multicast Address (ff00::/8)';
    }
    if (lower.startsWith('2') || lower.startsWith('3')) {
      return 'Global Unicast Address - GUA (2000::/3)';
    }
    if (lower.startsWith('::ffff:')) {
      return 'IPv4-Mapped IPv6 Address';
    }
    return 'Unicast Reservada / Otro rango';
  }

  function validateIPv4(ip) {
    const parts = ip.split('.');
    
    if (parts.length < 4) {
      return {
        isValid: false,
        message: `Formato incompleto: se tienen ${parts.length} de 4 octetos requeridos.`,
        details: { count: `${parts.length} / 4 octetos`, compression: 'N/A', type: 'Incompleta' }
      };
    }

    if (parts.length > 4) {
      return {
        isValid: false,
        message: `Demasiados octetos: se ingresaron ${parts.length} (el estándar IPv4 consta de 4 octetos).`,
        details: { count: `${parts.length} / 4 octetos`, compression: 'N/A', type: 'Inválida' }
      };
    }

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (!/^\d+$/.test(p)) {
        return {
          isValid: false,
          message: `Octeto #${i + 1} ("${p}") contiene caracteres no numéricos o está vacío.`,
          details: { count: `${parts.length} / 4`, compression: 'N/A', type: 'Inválida' }
        };
      }
      const num = parseInt(p, 10);
      if (num < 0 || num > 255) {
        return {
          isValid: false,
          message: `Octeto #${i + 1} ("${p}") fuera de rango válido (debe estar entre 0 y 255).`,
          details: { count: `${parts.length} / 4`, compression: 'N/A', type: 'Rango excedido' }
        };
      }
      if (p.length > 1 && p.startsWith('0')) {
        return {
          isValid: false,
          message: `Octeto #${i + 1} ("${p}") no debe tener ceros a la izquierda.`,
          details: { count: `${parts.length} / 4`, compression: 'N/A', type: 'Cero a la izquierda' }
        };
      }
    }

    const typeInfo = classifyIPv4(ip);
    return {
      isValid: true,
      message: 'Dirección IPv4 válida: 4 octetos decimales (32 bits totales).',
      details: { count: '4 / 4 octetos', compression: 'N/A', type: typeInfo }
    };
  }

  function classifyIPv4(ip) {
    const octets = ip.split('.').map(Number);
    const [o1, o2] = octets;

    if (o1 === 127) return 'Loopback (127.0.0.0/8)';
    if (o1 === 10) return 'Red Privada Clase A (10.0.0.0/8)';
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return 'Red Privada Clase B (172.16.0.0/12)';
    if (o1 === 192 && o2 === 168) return 'Red Privada Clase C (192.168.0.0/16)';
    if (o1 === 169 && o2 === 254) return 'APIPA / Enlace Local (169.254.0.0/16)';
    if (o1 >= 224 && o1 <= 239) return 'Multicast Clase D';
    if (o1 >= 240) return 'Reservada Clase E';
    return 'IP Pública Global';
  }

  // =========================================================================
  // Actualización Visual de Estados (Rojo / Verde / Neutral)
  // =========================================================================
  function setValidState(message, details) {
    // Aviso con letras verdes si sí cumple
    statusMessage.className = 'status-message valid';
    statusText.textContent = `✔ ${message}`;
    
    inputWrapper.className = 'input-wrapper is-valid';
    statusIcon.textContent = '✅';

    updateMetricCards(details);
  }

  function setInvalidState(message, details) {
    // Aviso con letras rojas si no cumple
    statusMessage.className = 'status-message invalid';
    statusText.textContent = `❌ ${message}`;
    
    inputWrapper.className = 'input-wrapper is-invalid';
    statusIcon.textContent = '⚠️';

    updateMetricCards(details);
  }

  function setNeutralState() {
    statusMessage.className = 'status-message neutral';
    statusText.textContent = 'Ingresa una dirección IP para comenzar la validación.';
    
    inputWrapper.className = 'input-wrapper';
    statusIcon.textContent = '🌐';

    blocksCountEl.textContent = currentMode === 'ipv6' ? '0 / 8' : '0 / 4';
    blocksDetailEl.textContent = 'Esperando entrada...';
    compressionStatusEl.textContent = 'No detectada';
    compressionDetailEl.textContent = currentMode === 'ipv6' ? 'Válida una sola vez (::)' : 'No aplica para IPv4';
    ipTypeEl.textContent = 'No clasificada';
    ipTypeDetailEl.textContent = 'Escribe una dirección válida';
  }

  function updateMetricCards(details) {
    if (!details) return;
    if (details.count) blocksCountEl.textContent = details.count;
    if (details.compression) compressionStatusEl.textContent = details.compression;
    if (details.type) {
      ipTypeEl.textContent = details.type;
      ipTypeDetailEl.textContent = currentMode.toUpperCase();
    }
  }

  // =========================================================================
  // Botones de Acción (Limpiar y Copiar)
  // =========================================================================
  btnClear.addEventListener('click', () => {
    ipInput.value = '';
    setNeutralState();
    ipInput.focus();
    showToast('Campo limpiado');
  });

  btnCopy.addEventListener('click', async () => {
    const val = ipInput.value.trim();
    if (!val) {
      showToast('No hay ninguna dirección para copiar');
      return;
    }
    try {
      await navigator.clipboard.writeText(val);
      showToast('¡Dirección copiada al portapapeles!');
    } catch {
      // Fallback
      ipInput.select();
      document.execCommand('copy');
      showToast('¡Dirección copiada!');
    }
  });

  // Selector de separador manual
  separatorSelect.addEventListener('change', () => {
    updateValidation();
  });

  // Controladores de pestañas
  tabIPv6.addEventListener('click', () => switchMode('ipv6'));
  tabIPv4.addEventListener('click', () => switchMode('ipv4'));

  // Toast de notificación
  let toastTimeout;
  function showToast(text) {
    clearTimeout(toastTimeout);
    toast.textContent = text;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // Inicialización
  renderExamples('ipv6');
  setNeutralState();
});
