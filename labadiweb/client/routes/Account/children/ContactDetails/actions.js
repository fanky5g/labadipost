export function editContact() {

}

export function setAddressEditable(index, nextState) {
  return {
    type: 'SET_ADDRESS_EDITABLE',
    index,
    state: nextState,
  };
}

export function changeAddress(index, key, value) {
  return {
    type: 'EDIT_ADDRESS',
    key,
    index,
    value,
  };
}

export function revertAddress(oldAddress) {
  return {
    type: 'REVERT_ADDRESS',
    address: oldAddress,
  };
}

export function addAddress() {
  return {
    type: 'ADD_ADDRESS',
  };
}

export function toggleAddressActive(index, state) {
  return {
    type: 'TOGGLE_ADDRESS_ACTIVE',
    index,
    state,
  };
}

export function MtoggleAddressActive(delegateIndex, index, state) {
  return {
    type: 'TOGGLE_DELEGATE_ADDRESS_ACTIVE',
    dIndex: delegateIndex,
    index,
    state,
  };
}

export function MsetAddressEditable(delegateIndex, index, state) {
  return {
    type: 'SET_DELEGATE_ADDRESS_EDITABLE',
    dIndex: delegateIndex,
    index,
    state,
  };
}

export function MhandleAddressEdit(delegateIndex, addressIndex, key, value) {
  return {
    type: 'EDIT_DELEGATE_ADDRESS',
    dIndex: delegateIndex,
    index: addressIndex,
    key,
    value,
  };
}

export function MaddAddress(dIndex) {
  return {
    type: 'ADD_DELEGATE_ADDRESS',
    dIndex,
  };
}
