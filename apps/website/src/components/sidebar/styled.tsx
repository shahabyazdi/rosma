import styled from '@emotion/styled';
import { SIDEBAR_WIDTH } from '.';

export const StyledSidebar = styled.aside<{ active: string }>(({ active }) => ({
  position: 'absolute',
  left: 0,
  top: 55,
  bottom: 0,
  width: SIDEBAR_WIDTH,
  boxShadow: '2px 5px 5px #ccc',
  backgroundColor: 'white',
  zIndex: 1,
  '@media(max-width:700px)': {
    left: active === 'false' ? -SIDEBAR_WIDTH : 0,
    transition: '0.4s',
    position: 'fixed',
  },
}));

export const SideBarList = styled.ul({
  listStyle: 'none',
  margin: 0,
  padding: '2px 15px',
});

export const SideBarItem = styled.li<{ active: string }>(({ active }) => ({
  fontWeight: active === 'true' ? 'bold' : 'normal',
  marginTop: 4,
}));

export const StyledDropdown = styled.div({
  display: 'grid',
  position: 'absolute',
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
