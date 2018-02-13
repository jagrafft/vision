package co.grafft.vision.av

import com.typesafe.config._

object AV extends Version with App {
  println(s"co.grafft.vision.av: $version")
}

trait Version {
  lazy val version: String = "0.1.0-SNAPSHOT"
}