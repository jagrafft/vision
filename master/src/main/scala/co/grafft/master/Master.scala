package co.grafft.vision.master

object Master extends Version with App {
  println(version)
}

trait Master {
  lazy val version: String = "0.1.0-SNAPSHOT"
}