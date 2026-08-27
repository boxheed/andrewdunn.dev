---
title: 'Migrating from Maven to Gradle: A Post-Mortem'
date: 2023-03-16
description: 'Why we abandoned Maven and the technical tradeoffs of adopting Gradle.'
---

It was time to leave Maven behind. The XML verbosity had become unbearable, and our build times were suffering. We decided to migrate to Gradle to take advantage of its incremental builds and Kotlin DSL.

## The Problem with Maven

Maven's declarative XML configuration is great for simple projects, but as our monorepo grew, the `<plugin>` configurations became unwieldy.

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.8.1</version>
    <configuration>
        <source>11</source>
        <target>11</target>
    </configuration>
</plugin>
```

## The Gradle Solution

Switching to Gradle allowed us to express our build logic concisely.

```kotlin
plugins {
    id("java")
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("junit:junit:4.13.2")
}
```

The migration wasn't without its challenges, particularly around dependency resolution, but the resulting build speed improvements were well worth the effort.
