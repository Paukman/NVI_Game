# Customize and Implement Ant Design 

## Use less for all future styling 

Ant Design uses `less` for their css preprocessor and their variables(`@import '~antd/lib/style/themes/default.less'; `) are exported and available for us. There is no point to import `less` and convert it into `sass` and then assign their `less` variables using `sass`.

### Step one
 Customize the Theme to match the UX requirements.

This is the most important step. 
Ant design comes with set of default variables: https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
Setting up these variables will change the ant core css(when compiled). Always start from changing the variables FIRST.
What variables are applied to what component? This may not be obvious and to find out you need to fork the ant repo and take a look into the `less` files for a particular component.

Not every element can be styles with the provided variables. When you are 100% sure that this can't be done with the defaults move to the step two.

### Step two
Add your `less` styles to the `ant-styles` folder(the folder name can be changed). If you still beleive that there is a better approach and you are not sure how to solve it, ask the ant design core team.  If you have a better solution file an issue with propoesed changes
https://github.com/ant-design/ant-design/issues/25462. Go with their solution if no changes will be made.

### Step three
Create a React component only if it's needed. If you need to hide some default classes you can create a component that will add those to the ant React core component.


### Variables are defined in a style guide.
All variables have to be defined in a style guide. Color palette, borders styles, fonts etc.


## Adding Ant to the Current project.
Replace them component by component. Start from `in` and work the way `out`. Single components like (Buttons, Input, Date Picker) can be easily replaced with what we have now. 
Use the Grid as the main responsive layout.Everyting on the screen is positioned as Rows and Columns, let the framework deal with the different screen sizes.
If you need to implement custom css on the component level, go back to step one and see if you really need to do that.If this is a very specific to this project requirement then write your css(less) and keep it local.


## Add the new components to the styles page

It is good to have the new components in the current app so all the styles can be loaded, `semantic`, `material`,`antd` and the custom so we can detect if there are colusions. 

UX can review these components in isolation. No need for components review(fonts, colors) in every story.

