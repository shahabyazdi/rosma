import styled from '@emotion/styled';

export const StyledSidebar = styled.aside<{ active: string }>(({ active }) => ({
  position: 'fixed',
  left: 0,
  top: 55,
  bottom: 0,
  width: 210,
  borderRight: '1px solid #ccc',
  backgroundColor: 'white',
  '@media(max-width:700px)': {
    left: active === 'false' ? -210 : 0,
    transition: '0.4s',
  },
}));

export const SideBarList = styled.ul({ listStyle: 'none' });

export const SideBarItem = styled.li<{ active: string }>(({ active }) => ({
  fontWeight: active === 'true' ? 'bold' : 'normal',
}));

export const StyledDropdown = styled.div({
  display: 'grid',
  position: 'fixed',
  top: 55,
  backgroundColor: 'white',
  minWidth: 120,
  right: 40,
  border: '1px solid #ccc',
  borderRadius: '0 0 7px 7px',
});

export const StyledDropdownItem = styled.div({
  padding: '5px 10px',
});
