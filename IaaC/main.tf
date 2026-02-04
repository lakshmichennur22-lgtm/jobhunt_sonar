# -----------------------
# LOCALS
# -----------------------
locals {
  name_prefix = "${var.project}-${var.application}-${var.environment}-${var.location_short}"
  rg_name     = "${local.name_prefix}-rg"
  tags = {
    project     = var.project
    application = var.application
    environment = var.environment
    location    = var.location
    blockcode   = var.blockcode
  }
}

# ---------------------------
# RESOURCE GROUP
# ---------------------------
resource "azurerm_resource_group" "rg" {
  name     = local.rg_name
  location = var.location
  tags     = local.tags
}

# ---------------------------
# VNET + SUBNET
# ---------------------------
resource "azurerm_virtual_network" "vnet" {
  name                = "${local.name_prefix}-vnet"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  address_space       = ["10.0.0.0/16"]
  tags                = local.tags
}

resource "azurerm_subnet" "subnet" {
  name                 = "${local.name_prefix}-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# ---------------------------
# PUBLIC IP (single VM)
# ---------------------------
resource "azurerm_public_ip" "pip" {
  name                = "${local.name_prefix}-pip"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

# ---------------------------
# NIC (single VM)
# ---------------------------
resource "azurerm_network_interface" "nic" {
  name                = "${local.name_prefix}-nic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.pip.id
  }
}

# ---------------------------
# LINUX VM (single)
# ---------------------------
resource "azurerm_linux_virtual_machine" "vm" {
  name                            = "${local.name_prefix}-vm"
  location                        = azurerm_resource_group.rg.location
  resource_group_name             = azurerm_resource_group.rg.name
  size                            = "Standard_F2"
  admin_username                  = "azureuser"
  disable_password_authentication = false
  admin_password                  = var.admin_password

  # optional: use cloud-init for pre-installing Node/PM2/Nginx
  custom_data = filebase64("cloud-init-script.sh")

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  network_interface_ids = [
    azurerm_network_interface.nic.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
}

# ---------------------------
# NSG
# ---------------------------
resource "azurerm_network_security_group" "nsg" {
  name                = "${local.name_prefix}-nsg"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "AllowHTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowSSHFromAny"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# Attach NSG to subnet
resource "azurerm_subnet_network_security_group_association" "subnet_nsg" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}
