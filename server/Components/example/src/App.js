import './App.css';
import {
  Pagination,
  Icon,
  GlobalThemeProvider,
  Dropdown,
  InputField,
  Checkbox,
  DataTable,
  Modal,
  Image,
  ToolBar,
  ToolBarItem,
  Button,
  Card,
  Search,
  SearchableDropdown,
  Switch,
  Grid,
  GridItem,
  FullPageLayout,
} from 'mdo-react-components';

function App() {
  return (
    <GlobalThemeProvider>
      <div className='page'>
        <p>This is an example react app to showcase components from the `mdo-react-component` library.</p>
        <section>
          <h1>Pagination</h1>
          <Pagination count={10} />
        </section>
        <section>
          <h1>Icon</h1>
          <Icon name='calendar' />
        </section>
        <section>
          <h1>Checkbox</h1>
          <Checkbox defaultChecked /> <br />
        </section>
        <section>
          <h1>Image</h1>
          <Image src='https://kitsforacause.com/wp-content/uploads/Back-to-School-Kits.jpg' /> <br />
        </section>
        <section>
          <h1>Modal</h1>
          <Modal>
            <p>Modal</p>
          </Modal>
          <br />
        </section>
        <section>
          <h1>Dropdown</h1>
          <Dropdown
            labelName='libraries'
            onChange={(e) => {}}
            items={[
              {
                label: 'react',
                value: 'react',
              },
              {
                label: 'redux',
                value: 'redux',
              },
              {
                label: 'flux',
                value: 'flux',
              },
            ]}
          />
          <Card>
            <Button text='sample button' />
          </Card>
        </section>
        <section>
          <h1>Search Bar</h1>
          <Search
            label='search'
            onChange={(v) => {
              console.log(v);
            }}
            loading={true}
          />
        </section>
        <section>
          <h1>ToolBar and ToolBarItem</h1>
          <ToolBar>
            <ToolBarItem>
              <Icon name='calendar' />
            </ToolBarItem>
            <ToolBarItem>
              <Icon name='cake' />
            </ToolBarItem>
            <ToolBarItem>Some Static Text</ToolBarItem>
            <ToolBarItem toTheRight>
              <Button variant='primary' text='Click Me' />
            </ToolBarItem>
          </ToolBar>
        </section>
        <section>
          <h1>Search Bar</h1>
          <Search
            label='search'
            onChange={(v) => {
              console.log(v);
            }}
            loading={true}
          />
          <h1>SearchableDropdown</h1>
          <SearchableDropdown
            label='Select'
            size='100%'
            onChange={(e) => {}}
            items={[
              {
                label: 'The Shawshank Redemption',
                value: 'The Shawshank Redemption',
              },
              {
                label: 'The Godfather',
                value: 'The Godfather',
              },
              {
                label: 'Apple Godfather',
                value: 'Apple Godfather',
              },
              {
                label: 'The Dark Knight',
                value: 'The Dark Knight',
              },
              {
                label: '12 Angry Men',
                value: '12 Angry Men',
              },
              {
                label: "Schindler's List",
                value: "Schindler's List",
              },
              {
                label: 'Pulp Fiction',
                value: 'Pulp Fiction',
              },
              {
                label: 'The Lord of the Rings: The Return of the King',
                value: 'The Lord of the Rings: The Return of the King',
              },
              {
                label: 'The Good, the Bad and the Ugly',
                value: 'The Good, the Bad and the Ugly',
              },
            ]}
          />{' '}
        </section>
        <section>
          <h1>Button</h1>
          <Button variant='secondary' size='large' iconName='calendar' />
        </section>
        <section>
          <h1>Grid</h1>
          <Grid
            xs='auto'
            sm='auto'
            md='auto'
            lg='auto'
            xl='auto'
            zeroMinWidth={true}
            wrap='wrap'
            spacing={0}
            alignContent='stretch'
            alignItems='flex-start'
            direction='row'
            justify='flex-start'
          >
            <Grid item xs={3}></Grid>
          </Grid>
        </section>
        <section>
          <h1>GridItem</h1>
          <GridItem
            xs='auto'
            sm='auto'
            md='auto'
            lg='auto'
            xl='auto'
            zeroMinWidth={true}
            wrap='wrap'
            spacing={0}
            alignContent='stretch'
            alignItems='flex-start'
            direction='row'
            justify='flex-start'
          />
        </section>
        <section>
          <h1>Switch</h1>
          <Switch />
        </section>
        <section>
          <h1>Full Page Layout Component</h1>
          <FullPageLayout>
            <div>Full Page Layout Component</div>
          </FullPageLayout>
        </section>
      </div>
    </GlobalThemeProvider>
  );
}

export default App;
