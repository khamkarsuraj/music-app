# Introduction
This is a single-page React Native application that supports Android and iOS devices to play songs with features like repeat modes, share, like, and delete.

## Getting Started

### Step 0: Installation

First, you will need to install the necessary packages using npm. To do so, clone the repo into your local machine. Then, follow the below steps.

Go to the root directory of **music-app**. And install packages listed in **package.json**.

```bash
npm install
```

After that, go to the **ios** directory and install the pod.

```bash
pod install
```
Once you are done with this, go to the root directory again and follow the below steps.


### Step 1: Start the Metro Server

Then, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start
```

### Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

#### For iOS

```bash
# using npm
npm run ios
```

#### For Android

```bash
# using npm
npm run android
```

If everything is set up _correctly_, you should see a new app running in _Android Emulator_ or _iOS Simulator_ shortly, provided you have set up your emulator/simulator correctly.

This is one way to run your app — also, you can run it directly from within Android Studio and Xcode, respectively.


### Demo and Screenshots
Here are some screenshots of the app working on my local machine.

##### Demo
https://github.com/khamkarsuraj/music-app/assets/112414255/9eeeaf30-0fae-473a-af90-e844f093c2c4

##### Home Screen
![Alt text](https://github.com/khamkarsuraj/music-app/blob/main/working/welcome.png)

##### Song on repeat
![Alt text](https://github.com/khamkarsuraj/music-app/blob/main/working/repeat.png)
