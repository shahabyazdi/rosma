import styled from '@emotion/styled';

export const StyledMain = styled.main({
  position: 'absolute',
  top: 60,
  left: 250,
  right: 0,
  bottom: 0,
  padding: 10,
  overflow: 'auto',
  '@media(max-width:700px)': {
    left: 0,
    transition: '0.4s',
  },
});

export const DocsPagination = styled.div({
  border: '1px solid #ccc',
  borderRadius: 7,
  margin: '20px auto',
  padding: 10,
  display: 'flex',
  maxWidth: 500,
  justifyContent: 'space-around',
  boxShadow: '0 0 5px #ccc',
});

export const DocsPage = styled.p({ flex: 1, textAlign: 'center' });

export const DocsPageTitle = styled.span({ fontWeight: 'bold' });

export const StyledDoc = styled.div({ minHeight: 300 });
